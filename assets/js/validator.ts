/**
 * Client-side field validator.
 *
 * v1.0 design constraints:
 * - ZERO network requests. Ever. Runs entirely in the browser.
 * - ZERO npm dependencies. Bundled via Hugo's js.Build pipe.
 * - Rules sourced from <script type="application/json" id="validator-rules">
 *   which is populated at build time from data/rules/{country}.json
 * - One instance per validator shortcode on the page.
 *
 * To add a new country:
 * 1. Create data/rules/{country}.json matching ThailandRules shape
 * 2. Update layouts/shortcodes/validator.html to pipe it through jsonify
 * 3. No code changes needed here — rules drive everything
 */

type FieldType = 'passport' | 'date' | 'flight' | 'name' | 'email' | 'phone';

interface FieldRule {
  type: FieldType;
  label: string;
  required: boolean;
  pattern?: string;       // regex string
  minLength?: number;
  maxLength?: number;
  placeholder?: string;
  help?: string;
  // Date-specific
  minDate?: string;       // ISO
  maxDate?: string;       // ISO
  // Error messages keyed by violation
  errors?: Record<string, string>;
}

interface CountryRules {
  country: string;
  fields: Record<string, FieldRule>;
}

interface ValidationResult {
  ok: boolean;
  message?: string;
}

function byId(id: string): HTMLElement | null {
  return document.getElementById(id);
}

function loadRules(container: HTMLElement): CountryRules | null {
  const script = container.querySelector<HTMLScriptElement>(
    'script[type="application/json"].validator-rules'
  );
  if (!script || !script.textContent) return null;
  try {
    return JSON.parse(script.textContent) as CountryRules;
  } catch (e) {
    console.warn('validator: rules JSON parse failed', e);
    return null;
  }
}

// ------ Field-specific validators ------

function validatePassport(value: string, rule: FieldRule): ValidationResult {
  const v = value.trim().toUpperCase();
  if (!v) {
    return rule.required
      ? { ok: false, message: rule.errors?.required || 'Required' }
      : { ok: true };
  }
  // ICAO 9303: alphanumeric, typically 6-9 chars, first char usually letter
  if (v.length < (rule.minLength ?? 6)) {
    return { ok: false, message: rule.errors?.tooShort || `Too short — min ${rule.minLength ?? 6} characters` };
  }
  if (v.length > (rule.maxLength ?? 9)) {
    return { ok: false, message: rule.errors?.tooLong || `Too long — max ${rule.maxLength ?? 9} characters` };
  }
  if (!/^[A-Z0-9]+$/.test(v)) {
    return { ok: false, message: rule.errors?.invalidChars || 'Letters and numbers only — no spaces or symbols' };
  }
  if (rule.pattern && !new RegExp(rule.pattern).test(v)) {
    return { ok: false, message: rule.errors?.invalidFormat || 'Does not match passport format' };
  }
  return { ok: true };
}

function validateDate(value: string, rule: FieldRule): ValidationResult {
  const v = value.trim();
  if (!v) {
    return rule.required
      ? { ok: false, message: rule.errors?.required || 'Required' }
      : { ok: true };
  }
  // Require strict YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) {
    return { ok: false, message: rule.errors?.invalidFormat || 'Use YYYY-MM-DD format (e.g. 2026-05-14)' };
  }
  const [yStr, mStr, dStr] = v.split('-');
  const y = parseInt(yStr, 10);
  const m = parseInt(mStr, 10);
  const d = parseInt(dStr, 10);
  if (m < 1 || m > 12) {
    return { ok: false, message: rule.errors?.invalidMonth || 'Month must be 01-12' };
  }
  const daysInMonth = new Date(y, m, 0).getDate();
  if (d < 1 || d > daysInMonth) {
    return { ok: false, message: rule.errors?.invalidDay || `Day must be 01-${daysInMonth} for month ${m}` };
  }
  const parsed = new Date(`${v}T00:00:00Z`);
  if (isNaN(parsed.getTime())) {
    return { ok: false, message: rule.errors?.invalid || 'Not a real date' };
  }
  if (rule.minDate) {
    const min = new Date(rule.minDate + 'T00:00:00Z');
    if (parsed < min) {
      return { ok: false, message: rule.errors?.tooEarly || `Date too far in past (before ${rule.minDate})` };
    }
  }
  if (rule.maxDate) {
    const max = new Date(rule.maxDate + 'T00:00:00Z');
    if (parsed > max) {
      return { ok: false, message: rule.errors?.tooLate || `Date too far in future (after ${rule.maxDate})` };
    }
  }
  return { ok: true };
}

function validateFlight(value: string, rule: FieldRule): ValidationResult {
  const v = value.trim().toUpperCase().replace(/\s+/g, '');
  if (!v) {
    return rule.required
      ? { ok: false, message: rule.errors?.required || 'Required' }
      : { ok: true };
  }
  // IATA format: 2 letters (airline) + 1-4 digits (flight number)
  // Accept also 3-letter ICAO variants
  if (!/^[A-Z0-9]{2,3}\d{1,4}[A-Z]?$/.test(v)) {
    return { ok: false, message: rule.errors?.invalidFormat || 'Format: airline code + number (e.g. TG312, UA1234)' };
  }
  return { ok: true };
}

function validateName(value: string, rule: FieldRule): ValidationResult {
  const v = value.trim();
  if (!v) {
    return rule.required
      ? { ok: false, message: rule.errors?.required || 'Required' }
      : { ok: true };
  }
  if (rule.minLength && v.length < rule.minLength) {
    return { ok: false, message: rule.errors?.tooShort || `Min ${rule.minLength} characters` };
  }
  if (rule.maxLength && v.length > rule.maxLength) {
    return { ok: false, message: rule.errors?.tooLong || `Max ${rule.maxLength} characters — check your passport for how it's abbreviated` };
  }
  // Passport names: Latin letters + spaces + hyphens + apostrophes only (ICAO)
  // Reject emoji, CJK, Arabic, etc — official sites don't accept them
  if (!/^[A-Za-z\s'\-]+$/.test(v)) {
    return { ok: false, message: rule.errors?.invalidChars || 'Use the Latin spelling from your passport — no accents or special characters' };
  }
  return { ok: true };
}

function validateEmail(value: string, rule: FieldRule): ValidationResult {
  const v = value.trim();
  if (!v) {
    return rule.required
      ? { ok: false, message: rule.errors?.required || 'Required' }
      : { ok: true };
  }
  // Simple email check — official sites usually do the same
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
    return { ok: false, message: rule.errors?.invalidFormat || 'Must look like name@example.com' };
  }
  if (v.length > (rule.maxLength ?? 80)) {
    return { ok: false, message: rule.errors?.tooLong || 'Too long' };
  }
  return { ok: true };
}

function validatePhone(value: string, rule: FieldRule): ValidationResult {
  const v = value.trim().replace(/[\s\-().]/g, '');
  if (!v) {
    return rule.required
      ? { ok: false, message: rule.errors?.required || 'Required' }
      : { ok: true };
  }
  // E.164-ish: optional +, then digits
  if (!/^\+?\d{7,15}$/.test(v)) {
    return { ok: false, message: rule.errors?.invalidFormat || 'Include country code, e.g. +1 415 555 0100' };
  }
  return { ok: true };
}

function validateField(value: string, rule: FieldRule): ValidationResult {
  switch (rule.type) {
    case 'passport': return validatePassport(value, rule);
    case 'date': return validateDate(value, rule);
    case 'flight': return validateFlight(value, rule);
    case 'name': return validateName(value, rule);
    case 'email': return validateEmail(value, rule);
    case 'phone': return validatePhone(value, rule);
    default:
      return { ok: true };
  }
}

// ------ DOM wiring ------

function renderState(row: HTMLElement, result: ValidationResult) {
  const state = row.querySelector<HTMLElement>('.validator-state');
  const err = row.querySelector<HTMLElement>('.validator-err-msg');
  if (!state) return;

  state.classList.remove('ok', 'err');
  if (!result.ok && result.message) {
    state.classList.add('err');
    state.textContent = 'Fix ✗';
    if (err) {
      err.textContent = result.message;
      err.style.display = '';
    }
  } else if (result.ok) {
    state.classList.add('ok');
    state.textContent = 'OK ✓';
    if (err) {
      err.textContent = '';
      err.style.display = 'none';
    }
  } else {
    // empty + not required
    state.classList.remove('ok', 'err');
    state.textContent = '';
    if (err) {
      err.textContent = '';
      err.style.display = 'none';
    }
  }
}

function wireValidator(container: HTMLElement) {
  const rules = loadRules(container);
  if (!rules) {
    console.warn('validator: no rules found for', container);
    return;
  }

  const rows = container.querySelectorAll<HTMLElement>('.validator-row[data-field]');
  rows.forEach((row) => {
    const fieldName = row.dataset.field;
    if (!fieldName) return;
    const rule = rules.fields[fieldName];
    if (!rule) return;

    const input = row.querySelector<HTMLInputElement>('input');
    if (!input) return;

    const runCheck = () => {
      const result = validateField(input.value, rule);
      renderState(row, result);
    };

    input.addEventListener('input', runCheck);
    input.addEventListener('blur', runCheck);
    // Run once on init if input has a default value
    if (input.value) runCheck();
  });
}

function init() {
  const containers = document.querySelectorAll<HTMLElement>('.validator[data-country]');
  containers.forEach(wireValidator);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Expose for debugging only — no global network surface
(window as any).__entrycardguide_validator = { validateField };
