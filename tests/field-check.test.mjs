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

test("text fields check required and maxLength, with or without a pattern", () => {
  const rule = { type: "text", label: "t", required: true, maxLength: 5, errors: { required: "need it", tooLong: "too long" } };
  assert.deepEqual(check("", rule), { ok: false, message: "need it" });
  assert.deepEqual(check("   ", rule), { ok: false, message: "need it" });
  assert.equal(check("abcde", rule).ok, true);
  assert.deepEqual(check("abcdef", rule), { ok: false, message: "too long" });
  const optional = { type: "text", label: "t", required: false, maxLength: 5 };
  assert.equal(check("", optional).ok, true);
  assert.deepEqual(check("abcdef", optional), { ok: false, message: "Max 5 characters" });
  assert.equal(check("x".repeat(500), { type: "text", label: "t", required: true }).ok, true);
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

// ---- 2026-10-15: the other validator countries, checked against each live form ----

test("a date rule can use MM/DD/YYYY or DD.MM.YYYY, with one- or two-digit day and month", () => {
  const mdy = { type: "date", label: "d", required: true, format: "MM/DD/YYYY" };
  assert.equal(check("08/22/1991", mdy).ok, true);
  assert.equal(check("8/22/1991", mdy).ok, true);
  assert.equal(check("22/08/1991", mdy).ok, false);
  assert.equal(check("1991-08-22", mdy).ok, false);
  const dot = { type: "date", label: "d", required: true, format: "DD.MM.YYYY" };
  assert.equal(check("22.08.1991", dot).ok, true);
  assert.equal(check("22/08/1991", dot).ok, false);
  assert.equal(check("31.02.1991", dot).ok, false);
});

const VN = rules("vietnam");
test("Vietnam e-visa: dates are DD/MM/YYYY; birth date up to today, passport not expired", () => {
  assert.equal(check("22/08/1991", VN.date_of_birth).ok, true);
  assert.equal(check("1991-08-22", VN.date_of_birth).ok, false);
  assert.equal(check("12/05/2026", VN.date_of_birth).ok, true);
  assert.equal(check("13/05/2026", VN.date_of_birth).ok, false);
  assert.equal(check("11/05/2026", VN.passport_expiry).ok, false);
  assert.equal(check("12/05/2030", VN.passport_expiry).ok, true);
  assert.equal(check("14/05/2026", VN.intended_arrival).ok, true);
  assert.equal(check("2026-05-14", VN.intended_arrival).ok, false);
});
test("Vietnam e-visa: names letters and spaces, passport up to 20, the form's email check", () => {
  assert.equal(check("NGUYEN VAN AN", VN.full_name).ok, true);
  assert.equal(check("O'BRIEN", VN.full_name).ok, false);
  assert.equal(check("NGUYỄN", VN.full_name).ok, false);
  assert.equal(check("B12345678", VN.passport).ok, true);
  assert.equal(check("A".repeat(21), VN.passport).ok, false);
  assert.equal(check("an.nguyen@gmail.com", VN.email).ok, true);
  assert.equal(check("a+b@gmail.com", VN.email).ok, true);
  assert.equal(check("an@gmail", VN.email).ok, false);
  assert.equal(check("an nguyen@gmail.com", VN.email).ok, false);
});

const PH = rules("philippines");
test("eTravel: dates are MM/DD/YYYY; arrival today to 4 days ahead", () => {
  assert.equal(check("08/22/1991", PH.date_of_birth).ok, true);
  assert.equal(check("22/08/1991", PH.date_of_birth).ok, false);
  assert.equal(check("05/13/2026", PH.date_of_birth).ok, false);
  assert.equal(check("05/12/2026", PH.arrival_date).ok, true);
  assert.equal(check("05/16/2026", PH.arrival_date).ok, true);
  assert.equal(check("05/17/2026", PH.arrival_date).ok, false);
  assert.equal(check("05/11/2026", PH.arrival_date).ok, false);
});
test("eTravel: passport number at least 5 characters", () => {
  assert.equal(check("P1234", PH.passport).ok, true);
  assert.equal(check("P123", PH.passport).ok, false);
});

const IN = rules("india");
test("India e-Arrival: arrival DD/MM/YYYY, today to 4 days ahead", () => {
  assert.equal(check("12/05/2026", IN.arrival_date).ok, true);
  assert.equal(check("16/05/2026", IN.arrival_date).ok, true);
  assert.equal(check("17/05/2026", IN.arrival_date).ok, false);
  assert.equal(check("11/05/2026", IN.arrival_date).ok, false);
  assert.equal(check("2026-05-14", IN.arrival_date).ok, false);
});
test("India e-Arrival: name, passport, phone and address follow the form", () => {
  assert.equal(check("TARO KEN YAMADA", IN.full_name).ok, true);
  assert.equal(check("O'NEIL", IN.full_name).ok, false);
  assert.equal(check("A".repeat(201), IN.full_name).ok, false);
  assert.equal(check("A123456", IN.passport_number).ok, true);
  assert.equal(check("A1234", IN.passport_number).ok, false);
  assert.equal(check("A".repeat(16), IN.passport_number).ok, false);
  assert.equal(check("9012345678", IN.contact_number).ok, true);
  assert.equal(check("+81 90 1234 5678", IN.contact_number).ok, false);
  assert.equal(check("1234", IN.contact_number).ok, false);
  assert.equal(check("1".repeat(16), IN.contact_number).ok, false);
  assert.equal(check("8012345678", IN.emergency_contact_number).ok, true);
  assert.equal(check("80-1234-5678", IN.emergency_contact_number).ok, false);
  assert.equal(check("Hotel Taj, 1 Mansingh Road #2, New Delhi", IN.india_address).ok, true);
  assert.equal(check("Hotel; New Delhi", IN.india_address).ok, false);
  assert.equal(check("A".repeat(501), IN.india_address).ok, false);
});

const NZ = rules("new-zealand");
test("NZTD: names up to 39, given names optional; passport 3 to 9", () => {
  assert.equal(check("O'NEIL-SMITH", NZ.family_name).ok, true);
  assert.equal(check("JOSÉ", NZ.family_name).ok, false);
  assert.equal(check("A".repeat(40), NZ.family_name).ok, false);
  assert.equal(check("", NZ.given_names).ok, true);
  assert.equal(check("AB123456", NZ.passport_number).ok, true);
  assert.equal(check("AB", NZ.passport_number).ok, false);
  assert.equal(check("A1234567890", NZ.passport_number).ok, false);
});
test("NZTD: birth date up to today; air arrival from yesterday to 2 days ahead", () => {
  assert.equal(check("2026-05-12", NZ.date_of_birth).ok, true);
  assert.equal(check("2026-05-13", NZ.date_of_birth).ok, false);
  assert.equal(check("2026-05-11", NZ.arrival_date).ok, true);
  assert.equal(check("2026-05-14", NZ.arrival_date).ok, true);
  assert.equal(check("2026-05-10", NZ.arrival_date).ok, false);
  assert.equal(check("2026-05-15", NZ.arrival_date).ok, false);
});
test("NZTD: flight search, email and phone use the form's patterns", () => {
  assert.equal(check("NZ1", NZ.flight_number).ok, true);
  assert.equal(check("NZ 1", NZ.flight_number).ok, true);
  assert.equal(check("nz1", NZ.flight_number).ok, true);
  assert.equal(check("3C123", NZ.flight_number).ok, true);
  assert.equal(check("ABC123", NZ.flight_number).ok, false);
  assert.equal(check("NZ12345", NZ.flight_number).ok, false);
  assert.equal(check("kiri@example.co.nz", NZ.email).ok, true);
  assert.equal(check("kiri..x@example.com", NZ.email).ok, false);
  assert.equal(check(".kiri@example.com", NZ.email).ok, false);
  assert.equal(check("kiri@example", NZ.email).ok, false);
  assert.equal(check("21 123 4567", NZ.phone).ok, true);
  assert.equal(check("(21) 123-4567", NZ.phone).ok, true);
  assert.equal(check("+64 21 123 4567", NZ.phone).ok, false);
  assert.equal(check("21  123 4567", NZ.phone).ok, false);
  assert.equal(check("(21 123 4567", NZ.phone).ok, false);
  assert.equal(check("1234", NZ.phone).ok, false);
});

const UK = rules("uk");
test("UK ETA: date of birth in the past; the form's email check", () => {
  assert.equal(check("2026-05-12", UK.date_of_birth).ok, true);
  assert.equal(check("2026-05-13", UK.date_of_birth).ok, false);
  assert.equal(check("taro@example.co.uk", UK.email).ok, true);
  assert.equal(check("taro@example", UK.email).ok, false);
});

const US = rules("usa");
test("ESTA: name characters, passport 6 to 10, birth date up to today", () => {
  assert.equal(check("O'NEIL, JR", US.full_name).ok, true);
  assert.equal(check("JOSÉ", US.full_name).ok, false);
  assert.equal(check("A1234567", US.passport).ok, true);
  assert.equal(check("A1234", US.passport).ok, false);
  assert.equal(check("A1234567890", US.passport).ok, false);
  assert.equal(check("2026-05-13", US.date_of_birth).ok, false);
});
test("ESTA: email up to 100 with the form's pattern; phone digits and spaces up to 20", () => {
  assert.equal(check("a+b@example.com", US.email).ok, true);
  assert.equal(check("a@b", US.email).ok, false);
  assert.equal(check(`${"a".repeat(90)}@example.com`, US.email).ok, false);
  assert.equal(check("20 7946 0958", US.phone).ok, true);
  assert.equal(check("+44 20 7946 0958", US.phone).ok, false);
  assert.equal(check("1".repeat(21), US.phone).ok, false);
});

const TR = rules("turkey");
test("Türkiye e-Visa: dates are DD.MM.YYYY with the form's windows", () => {
  assert.equal(check("15.09.2026", TR.arrival_date).ok, true);
  assert.equal(check("2026-09-15", TR.arrival_date).ok, false);
  assert.equal(check("11.05.2026", TR.arrival_date).ok, false);
  assert.equal(check("22.08.1991", TR.date_of_birth).ok, true);
  assert.equal(check("13.05.2026", TR.date_of_birth).ok, false);
  assert.equal(check("13.05.2026", TR.passport_issue_date).ok, false);
  assert.equal(check("11.05.2026", TR.passport_expiry).ok, false);
  assert.equal(check("29.09.2033", TR.passport_expiry).ok, true);
});
test("Türkiye e-Visa: web form lengths for passport, email and address", () => {
  assert.equal(check("A".repeat(20), TR.passport_number).ok, true);
  assert.equal(check("A".repeat(21), TR.passport_number).ok, false);
  assert.equal(check(`${"a".repeat(80)}@example.com`, TR.email).ok, true);
  assert.equal(check(`${"a".repeat(90)}@example.com`, TR.email).ok, false);
  assert.equal(check("A".repeat(51), TR.mothers_name).ok, false);
});

const CA = rules("canada");
test("Canada eTA: date of birth up to today", () => {
  assert.equal(check("2026-05-12", CA.date_of_birth).ok, true);
  assert.equal(check("2026-05-13", CA.date_of_birth).ok, false);
});

const KH = rules("cambodia");
test("Cambodia e-Arrival: m/d/yyyy dates, arrival today to 6 days ahead", () => {
  assert.equal(check("5/12/2026", KH.arrival_date).ok, true);
  assert.equal(check("05/18/2026", KH.arrival_date).ok, true);
  assert.equal(check("05/19/2026", KH.arrival_date).ok, false);
  assert.equal(check("12/05/2026", KH.arrival_date).ok, false);
  assert.equal(check("2026-05-14", KH.arrival_date).ok, false);
  assert.equal(check("8/22/1991", KH.date_of_birth).ok, true);
  assert.equal(check("5/13/2026", KH.date_of_birth).ok, false);
});
test("Cambodia e-Arrival: names letters, digits and spaces; flight box digits only", () => {
  assert.equal(check("SOK DARA", KH.full_name).ok, true);
  assert.equal(check("O'BRIEN", KH.full_name).ok, false);
  assert.equal(check("817", KH.flight_number).ok, true);
  assert.equal(check("K6817", KH.flight_number).ok, false);
});

const ID = rules("indonesia");
test("All Indonesia: DD/MM/YYYY dates; arrival from yesterday to 2 days ahead", () => {
  assert.equal(check("22/08/1991", ID.date_of_birth).ok, true);
  assert.equal(check("1991-08-22", ID.date_of_birth).ok, false);
  assert.equal(check("13/05/2026", ID.date_of_birth).ok, false);
  assert.equal(check("11/05/2026", ID.arrival_date).ok, true);
  assert.equal(check("14/05/2026", ID.arrival_date).ok, true);
  assert.equal(check("15/05/2026", ID.arrival_date).ok, false);
  assert.equal(check("10/05/2026", ID.arrival_date).ok, false);
});
test("All Indonesia: full name letters and spaces only", () => {
  assert.equal(check("PUTRI AYU", ID.full_name).ok, true);
  assert.equal(check("O'BRIEN", ID.full_name).ok, false);
});

const JP = rules("japan");
test("Visit Japan Web: arrival YYYY/MM/DD from today; capital-letter names", () => {
  assert.equal(check("2026/05/12", JP.arrival_date).ok, true);
  assert.equal(check("2026-05-12", JP.arrival_date).ok, false);
  assert.equal(check("2026/05/11", JP.arrival_date).ok, false);
  assert.equal(check("2026-05-13", JP.date_of_birth).ok, false);
  assert.equal(check("YAMADA TARO", JP.full_name).ok, true);
  assert.equal(check("SMITH-JONES", JP.full_name).ok, true);
  assert.equal(check("yamada taro", JP.full_name).ok, false);
  assert.equal(check("O'NEIL", JP.full_name).ok, false);
});
test("Visit Japan Web: passport up to 9, flight capitals and digits up to 20", () => {
  assert.equal(check("TR1234567", JP.passport).ok, true);
  assert.equal(check("TR12345678", JP.passport).ok, false);
  assert.equal(check("JL5", JP.flight_number).ok, true);
  assert.equal(check("JL 5", JP.flight_number).ok, false);
  assert.equal(check("jl5", JP.flight_number).ok, false);
  assert.equal(check("A".repeat(21), JP.flight_number).ok, false);
});

const KR = rules("korea");
test("K-EAC: passport name letters and spaces; email box drops +", () => {
  assert.equal(check("KIM MINJUN", KR.full_name).ok, true);
  assert.equal(check("KIM-MINJUN", KR.full_name).ok, false);
  assert.equal(check("2026-05-13", KR.date_of_birth).ok, false);
  assert.equal(check("minjun@naver.com", KR.email).ok, true);
  assert.equal(check("min+jun@naver.com", KR.email).ok, false);
  // The form's own check is loose (its '\.' sits in a string, so it matches any character).
  assert.equal(check("minjun.naver.com", KR.email).ok, false);
});

const MX = rules("mexico");
test("FMM: dates DD/MM/YYYY; arrival today to 29 days ahead", () => {
  assert.equal(check("12/05/2026", MX.arrival_date).ok, true);
  assert.equal(check("10/06/2026", MX.arrival_date).ok, true);
  assert.equal(check("11/06/2026", MX.arrival_date).ok, false);
  assert.equal(check("11/05/2026", MX.arrival_date).ok, false);
  assert.equal(check("2026-05-14", MX.arrival_date).ok, false);
  assert.equal(check("22/08/1991", MX.date_of_birth).ok, true);
  assert.equal(check("13/05/2026", MX.date_of_birth).ok, false);
});
test("FMM: ICAO names up to 100, passport up to 15, address up to 40, email without +", () => {
  assert.equal(check("JOSÉ MARÍA", MX.given_name).ok, true);
  assert.equal(check("O'NEIL", MX.family_name).ok, true);
  assert.equal(check("SMITH-JONES", MX.family_name).ok, true);
  assert.equal(check("JOHN  SMITH", MX.given_name).ok, false);
  assert.equal(check("A".repeat(101), MX.given_name).ok, false);
  assert.equal(check("G12345678", MX.passport).ok, true);
  assert.equal(check("A".repeat(16), MX.passport).ok, false);
  assert.equal(check("HOTEL RIU, AV. KUKULCAN 5", MX.destination_address).ok, true);
  assert.equal(check("Hotel #5", MX.destination_address).ok, false);
  assert.equal(check("A".repeat(41), MX.destination_address).ok, false);
  assert.equal(check("john.doe@example.com", MX.email).ok, true);
  assert.equal(check("john+doe@example.com", MX.email).ok, false);
});

const SG = rules("singapore");
test("SG Arrival Card: DD/MM/YYYY; arrival today to 2 days ahead", () => {
  assert.equal(check("12/05/2026", SG.arrival_date).ok, true);
  assert.equal(check("14/05/2026", SG.arrival_date).ok, true);
  assert.equal(check("15/05/2026", SG.arrival_date).ok, false);
  assert.equal(check("22/08/1991", SG.date_of_birth).ok, true);
  assert.equal(check("1991-08-22", SG.date_of_birth).ok, false);
  assert.equal(check("13/05/2026", SG.date_of_birth).ok, false);
});
test("SG Arrival Card: name, passport, flight and email follow the form", () => {
  assert.equal(check("TAN WEI MING", SG.full_name).ok, true);
  assert.equal(check("O'NEIL-LEE (JR.)", SG.full_name).ok, true);
  assert.equal(check("1TAN", SG.full_name).ok, false);
  assert.equal(check("A".repeat(67), SG.full_name).ok, false);
  assert.equal(check("K1234567A", SG.passport).ok, true);
  assert.equal(check("A".repeat(21), SG.passport).ok, false);
  assert.equal(check("32", SG.flight_number).ok, true);
  assert.equal(check("SQ32", SG.flight_number).ok, false);
  assert.equal(check("a@b.co", SG.email).ok, true);
  assert.equal(check("a@b", SG.email).ok, false);
  assert.equal(check(`${"a".repeat(95)}@b.com`, SG.email).ok, false);
});

// ---- text fields without a pattern: required, and only the official maxLength ----

test("Turkey e-Visa: residence address up to 100, place of birth up to 40, both required", () => {
  assert.equal(check("A".repeat(100), TR.home_address).ok, true);
  assert.deepEqual(check("A".repeat(101), TR.home_address), { ok: false, message: TR.home_address.errors.tooLong });
  assert.equal(check("A".repeat(40), TR.place_of_birth).ok, true);
  assert.equal(check("A".repeat(41), TR.place_of_birth).ok, false);
  assert.deepEqual(check("", TR.home_address), { ok: false, message: TR.home_address.errors.required });
  assert.equal(check("   ", TR.place_of_birth).ok, false);
});

test("Vietnam e-visa: address in Vietnam takes up to 500, like the form", () => {
  assert.equal(check("A".repeat(500), VN.accommodation).ok, true);
  assert.equal(check("A".repeat(501), VN.accommodation).ok, false);
  assert.equal(check("", VN.accommodation).ok, false);
});

test("text fields carry no length limit the official form does not set", () => {
  // Drop-downs on the forms (VN, MX, ID ports of entry), split address fields
  // (SG), an address box with no maxLength (ID), a form not yet read (DO).
  const DO = rules("dominican");
  for (const rule of [VN.port_of_entry, MX.entry_point, ID.port_of_entry, ID.accommodation, SG.accommodation, DO.accommodation]) {
    assert.equal(rule.maxLength, undefined, rule.label);
    assert.equal(check("A".repeat(300), rule).ok, true, rule.label);
  }
});

test("Canada eTA: required free-text fields can no longer be left blank", () => {
  assert.equal(check("", CA.home_address).ok, false);
  assert.equal(check("12 MAPLE ST, TORONTO ON M5V 2T6", CA.home_address).ok, true);
});
