import test from "node:test";
import assert from "node:assert/strict";
import { formatForSheet, sheetItem } from "../assets/js/lib/prefill.ts";

test("passport numbers are upper-cased without spaces or dashes", () => {
  assert.equal(formatForSheet("passport", " a12-345 678 "), "A12345678");
});

test("names keep single spaces and match the passport's upper case", () => {
  assert.equal(formatForSheet("name", "  John   Quincy "), "JOHN QUINCY");
});

test("flight numbers lose inner spaces", () => {
  assert.equal(formatForSheet("flight", " tg 312 "), "TG312");
});

test("phone numbers keep the leading plus and drop separators", () => {
  assert.equal(formatForSheet("phone", "+1 (415) 555-0100"), "+14155550100");
});

test("nationality codes are upper-cased", () => {
  assert.equal(formatForSheet("nationality", " usa "), "USA");
});

test("dates stay in the ISO form the validator already enforces", () => {
  assert.equal(formatForSheet("date", " 2026-05-14 "), "2026-05-14");
});

test("emails are only trimmed", () => {
  assert.equal(formatForSheet("email", " Name@Example.com "), "Name@Example.com");
});

test("free text collapses runs of whitespace", () => {
  assert.equal(formatForSheet("text", " Hotel  Example,\n Kuala Lumpur "), "Hotel Example, Kuala Lumpur");
});

test("an empty required field is reported as missing", () => {
  assert.deepEqual(sheetItem("passport", true, "  ", { ok: false, message: "Required" }), { status: "missing", value: "" });
});

test("an empty optional field is skipped", () => {
  assert.deepEqual(sheetItem("phone", false, "", { ok: true }), { status: "skip", value: "" });
});

test("a field that fails validation carries the validator's message", () => {
  assert.deepEqual(
    sheetItem("date", true, "22/08/1991", { ok: false, message: "Use YYYY-MM-DD format" }),
    { status: "fix", value: "22/08/1991", message: "Use YYYY-MM-DD format" },
  );
});

test("a valid field is formatted for pasting", () => {
  assert.deepEqual(sheetItem("passport", true, "a1234567", { ok: true }), { status: "ok", value: "A1234567" });
});
