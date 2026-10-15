/**
 * Copy-sheet helpers for the validator. Pure functions, no DOM, no network —
 * shared by validator.ts and tests/prefill-sheet.test.mjs.
 *
 * Formatting only cleans up what the validator already accepts (case, spaces,
 * separators). Dates stay as typed, in the format the field's rule asks for
 * (YYYY-MM-DD unless the rule sets another, e.g. DD/MM/YYYY for the MDAC).
 */

export type SheetStatus = 'ok' | 'fix' | 'missing' | 'skip';

export interface SheetItem {
  status: SheetStatus;
  value: string;
  message?: string;
}

export function formatForSheet(type: string, raw: string): string {
  const v = raw.trim();
  switch (type) {
    case 'passport':
      return v.toUpperCase().replace(/[\s-]/g, '');
    case 'name':
      return v.replace(/\s+/g, ' ').toUpperCase();
    case 'flight':
      return v.toUpperCase().replace(/\s+/g, '');
    case 'nationality':
      return v.toUpperCase();
    case 'phone':
      return v.replace(/[\s\-().]/g, '');
    case 'date':
    case 'email':
      return v;
    default:
      return v.replace(/\s+/g, ' ');
  }
}

export function sheetItem(
  type: string,
  required: boolean,
  raw: string,
  result: { ok: boolean; message?: string },
): SheetItem {
  if (!raw.trim()) {
    return required ? { status: 'missing', value: '' } : { status: 'skip', value: '' };
  }
  if (!result.ok) {
    return { status: 'fix', value: raw.trim(), message: result.message };
  }
  return { status: 'ok', value: formatForSheet(type, raw) };
}
