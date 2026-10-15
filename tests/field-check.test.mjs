import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validateField } from "../assets/js/lib/field-check.ts";

const rules = (country) =>
  JSON.parse(readFileSync(new URL(`../data/rules/${country}.json`, import.meta.url), "utf8")).fields;
const MY = rules("malaysia");
const TH = rules("thailand");
// Fixed "today" so the date windows are deterministic: 12 May 2026.
const TODAY = new Date(2026, 4, 12);
const check = (value, rule) => validateField(value, rule, TODAY);

// ---- generic behaviour: rules without the new keys keep the old checks ----

test("dates default to YYYY-MM-DD", () => {
  const rule = { type: "date", label: "d", required: true };
  assert.equal(check("2026-05-14", rule).ok, true);
  assert.equal(check("14/05/2026", rule).ok, false);
});

test("names without a pattern still allow hyphens and apostrophes", () => {
  const rule = { type: "name", label: "n", required: true };
  assert.equal(check("SMITH-JONES", rule).ok, true);
  assert.equal(check("O'BRIEN", rule).ok, true);
});

test("emails without a pattern still allow a plus", () => {
  assert.equal(check("a+b@example.com", { type: "email", label: "e", required: true }).ok, true);
});

test("phones without a pattern still accept + and separators", () => {
  assert.equal(check("+1 415 555 0100", { type: "phone", label: "p", required: true }).ok, true);
});

test("flights without a pattern still need an airline code and number", () => {
  const rule = { type: "flight", label: "f", required: true };
  assert.equal(check("TG 312", rule).ok, true);
  assert.equal(check("THAI AIRWAYS", rule).ok, false);
});

// ---- new rule keys ----

test("a date rule can use DD/MM/YYYY or YYYY/MM/DD", () => {
  const dmy = { type: "date", label: "d", required: true, format: "DD/MM/YYYY", errors: { invalidFormat: "Use DD/MM/YYYY" } };
  assert.equal(check("22/08/1991", dmy).ok, true);
  assert.deepEqual(check("1991-08-22", dmy), { ok: false, message: "Use DD/MM/YYYY" });
  assert.equal(check("31/02/1991", dmy).ok, false);
  const ymd = { type: "date", label: "d", required: true, format: "YYYY/MM/DD" };
  assert.equal(check("2026/05/14", ymd).ok, true);
  assert.equal(check("2026-05-14", ymd).ok, false);
});

test("a date window is counted in days from today", () => {
  const rule = { type: "date", label: "d", required: true, minDaysFromToday: 0, maxDaysFromToday: 2, errors: { tooEarly: "past", tooLate: "later" } };
  assert.equal(check("2026-05-12", rule).ok, true);
  assert.equal(check("2026-05-14", rule).ok, true);
  assert.deepEqual(check("2026-05-15", rule), { ok: false, message: "later" });
  assert.deepEqual(check("2026-05-11", rule), { ok: false, message: "past" });
});

test("a pattern on a name, email, phone or flight rule replaces the default check", () => {
  assert.equal(check("SMITH-JONES", { type: "name", label: "n", required: true, pattern: "^[A-Za-z ]+$" }).ok, false);
  assert.equal(check("a+b@example.com", { type: "email", label: "e", required: true, pattern: "^[a-z.]+@[a-z.]+$" }).ok, false);
  assert.equal(check("+8613812345678", { type: "phone", label: "p", required: true, pattern: "^\\d+$" }).ok, false);
  assert.equal(check("BUS 12", { type: "flight", label: "f", required: true, pattern: "^[A-Za-z0-9 ]+$" }).ok, true);
});

test("phone and flight rules enforce maxLength", () => {
  const phone = { type: "phone", label: "p", required: true, pattern: "^\\d+$", maxLength: 12, errors: { invalidFormat: "digits" } };
  assert.equal(check("138123456789", phone).ok, true);
  assert.deepEqual(check("1381234567890", phone), { ok: false, message: "digits" });
  const flight = { type: "flight", label: "f", required: true, pattern: "^[A-Z0-9 ]+$", maxLength: 5, errors: { invalidFormat: "bad", tooLong: "long" } };
  assert.deepEqual(check("TG 3123", flight), { ok: false, message: "long" });
});

// ---- Malaysia MDAC: data/rules/malaysia.json matches the live form ----

test("MDAC: Name takes letters and spaces only, up to 60", () => {
  assert.equal(check("LIM WEI MING", MY.full_name).ok, true);
  assert.equal(check("O'BRIEN-LIM", MY.full_name).ok, false);
  assert.equal(check("A".repeat(61), MY.full_name).ok, false);
});

test("MDAC: dates are DD/MM/YYYY", () => {
  assert.equal(check("22/08/1991", MY.date_of_birth).ok, true);
  assert.equal(check("1991-08-22", MY.date_of_birth).ok, false);
});

test("MDAC: date of birth stops at yesterday", () => {
  assert.equal(check("11/05/2026", MY.date_of_birth).ok, true);
  assert.equal(check("12/05/2026", MY.date_of_birth).ok, false);
});

test("MDAC: arrival is today or the next two days", () => {
  assert.equal(check("12/05/2026", MY.arrival_date).ok, true);
  assert.equal(check("14/05/2026", MY.arrival_date).ok, true);
  assert.equal(check("15/05/2026", MY.arrival_date).ok, false);
  assert.equal(check("11/05/2026", MY.arrival_date).ok, false);
});

test("MDAC: passport expiry and departure start today", () => {
  assert.equal(check("11/05/2026", MY.passport_expiry).ok, false);
  assert.equal(check("12/05/2030", MY.passport_expiry).ok, true);
  assert.equal(check("11/05/2026", MY.departure_date).ok, false);
  assert.equal(check("20/05/2026", MY.departure_date).ok, true);
});

test("MDAC: email uses the form's own check (no +)", () => {
  assert.equal(check("lim.weiming@gmail.com", MY.email).ok, true);
  assert.equal(check("lim+mdac@gmail.com", MY.email).ok, false);
});

test("MDAC: mobile is digits only, up to 12", () => {
  assert.equal(check("13812345678", MY.mobile).ok, true);
  assert.equal(check("+86 138 1234 5678", MY.mobile).ok, false);
  assert.equal(check("1381234567890", MY.mobile).ok, false);
});

test("MDAC: flight / vessel / transport number takes the form's characters, up to 30", () => {
  assert.equal(check("MH123", MY.flight_number).ok, true);
  assert.equal(check("BUS JHR 1234", MY.flight_number).ok, true);
  assert.equal(check("MH#123", MY.flight_number).ok, false);
  assert.equal(check("A".repeat(31), MY.flight_number).ok, false);
});

test("MDAC: passport number up to 12 letters and digits", () => {
  assert.equal(check("A12345678", MY.passport).ok, true);
  assert.equal(check("A-12345678", MY.passport).ok, false);
});

// ---- Thailand TDAC: data/rules/thailand.json matches the live form ----

test("TDAC: family name is letters and spaces, or a single -", () => {
  assert.equal(check("SMITH JONES", TH.family_name).ok, true);
  assert.equal(check("-", TH.family_name).ok, true);
  assert.equal(check("SMITH-JONES", TH.family_name).ok, false);
  assert.equal(check("A".repeat(61), TH.family_name).ok, false);
});

test("TDAC: first and middle names are letters and spaces only", () => {
  assert.equal(check("JOHN QUINCY", TH.given_name).ok, true);
  assert.equal(check("JOSÉ", TH.given_name).ok, false);
  assert.equal(check("", TH.middle_name).ok, true);
  assert.equal(check("Q.", TH.middle_name).ok, false);
});

test("TDAC: passport number is letters and digits up to 20", () => {
  assert.equal(check("a1234567", TH.passport).ok, true);
  assert.equal(check("A 1234567", TH.passport).ok, false);
  assert.equal(check("A".repeat(21), TH.passport).ok, false);
});

test("TDAC: arrival date is yyyy/mm/dd, today to 3 days ahead", () => {
  assert.equal(check("2026/05/15", TH.arrival_date).ok, true);
  assert.equal(check("2026/05/16", TH.arrival_date).ok, false);
  assert.equal(check("2026/05/11", TH.arrival_date).ok, false);
  assert.equal(check("2026-05-14", TH.arrival_date).ok, false);
});

test("TDAC: flight or vehicle number allows spaces, up to 20, no leading - + = @", () => {
  assert.equal(check("TG 312", TH.flight_number).ok, true);
  assert.equal(check("BUS 1234 BANGKOK", TH.flight_number).ok, true);
  assert.equal(check("-TG312", TH.flight_number).ok, false);
  assert.equal(check("TG312|A", TH.flight_number).ok, false);
  assert.equal(check("A".repeat(21), TH.flight_number).ok, false);
});

test("TDAC: email uses the form's own check, up to 50", () => {
  assert.equal(check("travel+th@gmail.com", TH.email).ok, true);
  assert.equal(check("travel @gmail.com", TH.email).ok, false);
  assert.equal(check("travel@gmail", TH.email).ok, false);
  assert.equal(check(`${"a".repeat(45)}@x.com`, TH.email).ok, false);
});

test("TDAC: phone number is digits only, up to 25", () => {
  assert.equal(check("4155550100", TH.phone).ok, true);
  assert.equal(check("+1 415-555-0100", TH.phone).ok, false);
  assert.equal(check("1".repeat(26), TH.phone).ok, false);
});

test("text fields stay unchecked unless the rule carries a pattern", () => {
  assert.equal(check("", { type: "text", label: "t", required: true }).ok, true);
  assert.equal(check("x", { type: "text", label: "t", required: true, pattern: "^\\d+$", errors: { invalidFormat: "digits" } }).message, "digits");
});

test("MDAC: address line 1 needs three words and the form's characters, up to 100", () => {
  assert.equal(check("MANDARIN ORIENTAL KUALA LUMPUR", MY.accommodation).ok, true);
  assert.equal(check("1, JALAN PINANG (LOBBY)", MY.accommodation).ok, true);
  assert.equal(check("AIRBNB", MY.accommodation).ok, false);
  assert.equal(check("N/A", MY.accommodation).ok, false);
  assert.equal(check("HOTEL #5 KL", MY.accommodation).ok, false);
  assert.equal(check(`A B ${"C".repeat(97)}`, MY.accommodation).ok, false);
  assert.equal(check("", MY.accommodation).ok, false);
});
