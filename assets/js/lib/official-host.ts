/**
 * Compare a pasted web address with the official URLs in data/official_urls.
 * Pure functions, no DOM, no network — shared by domain-check.ts and the
 * node tests in tests/official-host.test.mjs.
 *
 * Matching is exact on the host name (after dropping "www." and a trailing
 * dot). A host that merely contains an official host, such as
 * tdac.immigration.go.th.example.com, is not a match.
 */

export interface OfficialEntry {
  url: string;
  main?: boolean;
}

export type OfficialMatch<T extends OfficialEntry> =
  | { status: 'match'; entries: T[] }
  | { status: 'no_match'; host: string }
  | { status: 'invalid' };

export function hostFromInput(input: string): string | null {
  // People paste whole sentences; take the first token that looks like a domain.
  const token = input.trim().split(/\s+/).find((part) => part.includes('.'));
  if (!token) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(token) ? token : `https://${token}`;
  let host: string;
  try {
    host = new URL(withScheme).hostname;
  } catch {
    return null;
  }
  host = host.toLowerCase().replace(/\.$/, '').replace(/^www\./, '');
  return host.includes('.') ? host : null;
}

export function matchOfficial<T extends OfficialEntry>(input: string, entries: T[]): OfficialMatch<T> {
  const host = hostFromInput(input);
  if (!host) return { status: 'invalid' };
  const found = entries.filter((entry) => hostFromInput(entry.url) === host);
  if (found.length === 0) return { status: 'no_match', host };
  // Stable sort: the country's main form first, then data order.
  found.sort((a, b) => Number(Boolean(b.main)) - Number(Boolean(a.main)));
  return { status: 'match', entries: found };
}
