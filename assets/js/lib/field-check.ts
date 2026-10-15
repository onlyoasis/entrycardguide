/**
 * Field checks for the in-browser validator. Pure functions, no DOM, no
 * network — shared by assets/js/validator.ts and tests/field-check.test.mjs.
 *
 * A rule that carries `pattern` is checked against that regex (the official
 * form's own rule) instead of the built-in default for its type; for phone and
 * flight rules `maxLength` is then enforced too. Rules without `pattern` keep
 * the defaults; a `text` rule without one checks `required` and `maxLength`
 * only, so its `maxLength` must be the official form's own limit. Dates may
 * set `format` (default YYYY-MM-DD) and a window in days from today
 * (`minDaysFromToday` / `maxDaysFromToday`).
 */

export type FieldType = 'passport' | 'date' | 'flight' | 'name' | 'email' | 'phone' | 'text';

export type DateFormat = 'YYYY-MM-DD' | 'DD/MM/YYYY' | 'YYYY/MM/DD' | 'MM/DD/YYYY' | 'DD.MM.YYYY';

export interface FieldRule {
  type: FieldType;
  label: string;
  required: boolean;
  pattern?: string;       // regex string
  minLength?: number;
  maxLength?: number;
  placeholder?: string;
  help?: string;
  // Date-specific
  format?: DateFormat;    // how the date is typed; default YYYY-MM-DD
  minDate?: string;       // ISO
  maxDate?: string;       // ISO
  minDaysFromToday?: number; // 0 = today, -1 = yesterday
  maxDaysFromToday?: number;
  // Error messages keyed by violation
  errors?: Record<string, string>;
}

export interface CountryRules {
  country: string;
  fields: Record<string, FieldRule>;
  // Build-time display strings for the Fix/OK state chip. Present only in
  // localized payloads (zh-hant); the fallbacks keep EN/ZH output identical.
  ui?: { fix: string; ok: string };
}

export interface ValidationResult {
  ok: boolean;
  message?: string;
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

// Each format: the regex, and which capture group holds year, month, day.
// MM/DD/YYYY and DD.MM.YYYY take one- or two-digit day and month, as the
// date-fns and flatpickr parsers behind those forms do.
const DATE_FORMATS: Record<DateFormat, { re: RegExp; y: number; m: number; d: number }> = {
  'YYYY-MM-DD': { re: /^(\d{4})-(\d{2})-(\d{2})$/, y: 1, m: 2, d: 3 },
  'DD/MM/YYYY': { re: /^(\d{2})\/(\d{2})\/(\d{4})$/, y: 3, m: 2, d: 1 },
  'YYYY/MM/DD': { re: /^(\d{4})\/(\d{2})\/(\d{2})$/, y: 1, m: 2, d: 3 },
  'MM/DD/YYYY': { re: /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, y: 3, m: 1, d: 2 },
  'DD.MM.YYYY': { re: /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/, y: 3, m: 2, d: 1 },
};

const DAY_MS = 86_400_000;

function validateDate(value: string, rule: FieldRule, today: Date): ValidationResult {
  const v = value.trim();
  if (!v) {
    return rule.required
      ? { ok: false, message: rule.errors?.required || 'Required' }
      : { ok: true };
  }
  const format = rule.format ?? 'YYYY-MM-DD';
  const spec = DATE_FORMATS[format];
  const match = spec.re.exec(v);
  if (!match) {
    return { ok: false, message: rule.errors?.invalidFormat || `Use ${format} format` };
  }
  const y = parseInt(match[spec.y], 10);
  const m = parseInt(match[spec.m], 10);
  const d = parseInt(match[spec.d], 10);
  if (m < 1 || m > 12) {
    return { ok: false, message: rule.errors?.invalidMonth || 'Month must be 01-12' };
  }
  const daysInMonth = new Date(y, m, 0).getDate();
  if (d < 1 || d > daysInMonth) {
    return { ok: false, message: rule.errors?.invalidDay || `Day must be 01-${daysInMonth} for month ${m}` };
  }
  const parsed = new Date(Date.UTC(y, m - 1, d));
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
  if (rule.minDaysFromToday !== undefined || rule.maxDaysFromToday !== undefined) {
    // Calendar days in the browser's own time zone, like the official date pickers.
    const start = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    const days = Math.round((parsed.getTime() - start) / DAY_MS);
    if (rule.minDaysFromToday !== undefined && days < rule.minDaysFromToday) {
      return { ok: false, message: rule.errors?.tooEarly || 'Date is earlier than the form allows' };
    }
    if (rule.maxDaysFromToday !== undefined && days > rule.maxDaysFromToday) {
      return { ok: false, message: rule.errors?.tooLate || 'Date is later than the form allows' };
    }
  }
  return { ok: true };
}

// Official-rule mode for free-text fields: the rule's own regex and length.
function checkPattern(v: string, rule: FieldRule, fallback: string): ValidationResult {
  if (rule.maxLength && v.length > rule.maxLength) {
    return { ok: false, message: rule.errors?.tooLong || rule.errors?.invalidFormat || `Max ${rule.maxLength} characters` };
  }
  if (!new RegExp(rule.pattern as string).test(v)) {
    return { ok: false, message: rule.errors?.invalidFormat || fallback };
  }
  return { ok: true };
}

function validateFlight(value: string, rule: FieldRule): ValidationResult {
  const raw = value.trim();
  if (!raw) {
    return rule.required
      ? { ok: false, message: rule.errors?.required || 'Required' }
      : { ok: true };
  }
  if (rule.pattern) return checkPattern(raw, rule, 'Not accepted by the official form');
  const v = raw.toUpperCase().replace(/\s+/g, '');
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
  // Reject emoji, CJK, Arabic, etc — official sites don't accept them.
  // A rule pattern (the official form's own character set) replaces this.
  const allowed = rule.pattern ? new RegExp(rule.pattern) : /^[A-Za-z\s'\-]+$/;
  if (!allowed.test(v)) {
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
  // Simple email check, unless the rule carries the official form's regex
  const shape = rule.pattern ? new RegExp(rule.pattern) : /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!shape.test(v)) {
    return { ok: false, message: rule.errors?.invalidFormat || 'Must look like name@example.com' };
  }
  if (v.length > (rule.maxLength ?? 80)) {
    return { ok: false, message: rule.errors?.tooLong || 'Too long' };
  }
  return { ok: true };
}

function validatePhone(value: string, rule: FieldRule): ValidationResult {
  const raw = value.trim();
  if (!raw) {
    return rule.required
      ? { ok: false, message: rule.errors?.required || 'Required' }
      : { ok: true };
  }
  // Official-rule mode checks exactly what was typed: no stripping of + or spaces.
  if (rule.pattern) return checkPattern(raw, rule, 'Digits only');
  const v = raw.replace(/[\s\-().]/g, '');
  // E.164-ish: optional +, then digits
  if (!/^\+?\d{7,15}$/.test(v)) {
    return { ok: false, message: rule.errors?.invalidFormat || 'Include country code, e.g. +1 415 555 0100' };
  }
  return { ok: true };
}

function validateText(value: string, rule: FieldRule): ValidationResult {
  const v = value.trim();
  if (!v) {
    return rule.required
      ? { ok: false, message: rule.errors?.required || 'Required' }
      : { ok: true };
  }
  if (rule.pattern) return checkPattern(v, rule, 'Not accepted by the official form');
  if (rule.maxLength && v.length > rule.maxLength) {
    return { ok: false, message: rule.errors?.tooLong || `Max ${rule.maxLength} characters` };
  }
  return { ok: true };
}

export function validateField(value: string, rule: FieldRule, today: Date = new Date()): ValidationResult {
  switch (rule.type) {
    case 'passport': return validatePassport(value, rule);
    case 'date': return validateDate(value, rule, today);
    case 'flight': return validateFlight(value, rule);
    case 'name': return validateName(value, rule);
    case 'email': return validateEmail(value, rule);
    case 'phone': return validatePhone(value, rule);
    case 'text': return validateText(value, rule);
    default:
      return { ok: true };
  }
}
