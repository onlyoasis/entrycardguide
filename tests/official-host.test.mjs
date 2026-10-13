import test from "node:test";
import assert from "node:assert/strict";
import { hostFromInput, matchOfficial } from "../assets/js/lib/official-host.ts";

const entries = [
  { url: "https://www.immigration.go.th", country: "thailand", main: false },
  { url: "https://tdac.immigration.go.th", country: "thailand", main: true },
  { url: "https://imigresen-online.imi.gov.my/mdac/main", country: "malaysia", main: true },
  { url: "https://electronic-visa.kdmid.ru/faq", country: "russia", main: false },
  { url: "https://electronic-visa.kdmid.ru", country: "russia", main: true },
];

test("hostFromInput reads a bare domain", () => {
  assert.equal(hostFromInput("tdac.immigration.go.th"), "tdac.immigration.go.th");
});

test("hostFromInput drops scheme, path, hash, port and case", () => {
  assert.equal(hostFromInput("  HTTPS://TDAC.Immigration.go.th:443/arrival-card/#/home "), "tdac.immigration.go.th");
});

test("hostFromInput strips a leading www and a trailing dot", () => {
  assert.equal(hostFromInput("www.immigration.go.th."), "immigration.go.th");
});

test("hostFromInput finds the address inside pasted text", () => {
  assert.equal(hostFromInput("I was sent to https://imigresen-online.imi.gov.my/mdac today"), "imigresen-online.imi.gov.my");
});

test("hostFromInput rejects empty input and words without a domain", () => {
  assert.equal(hostFromInput("   "), null);
  assert.equal(hostFromInput("thailand arrival card"), null);
});

test("matchOfficial matches the official host whatever the path", () => {
  const result = matchOfficial("https://tdac.immigration.go.th/arrival-card/#/home", entries);
  assert.equal(result.status, "match");
  assert.equal(result.entries[0].country, "thailand");
});

test("matchOfficial treats www and the bare domain as the same host", () => {
  const result = matchOfficial("immigration.go.th", entries);
  assert.equal(result.status, "match");
  assert.equal(result.entries[0].url, "https://www.immigration.go.th");
});

test("matchOfficial puts the main form first when one host has several entries", () => {
  const result = matchOfficial("electronic-visa.kdmid.ru/support", entries);
  assert.equal(result.status, "match");
  assert.equal(result.entries.length, 2);
  assert.equal(result.entries[0].main, true);
});

test("matchOfficial does not accept a lookalike that only contains the official host", () => {
  assert.equal(matchOfficial("tdac.immigration.go.th.example.com", entries).status, "no_match");
  assert.equal(matchOfficial("tdac-immigration.go.th.com/apply", entries).status, "no_match");
});

test("matchOfficial does not accept a homoglyph domain", () => {
  // Cyrillic "і" in place of the Latin "i".
  assert.equal(matchOfficial("tdac.immіgration.go.th", entries).status, "no_match");
});

test("matchOfficial reports the host it compared on a miss", () => {
  assert.deepEqual(matchOfficial("https://www.example.com/tdac", entries), { status: "no_match", host: "example.com" });
});

test("matchOfficial reports input that is not an address", () => {
  assert.deepEqual(matchOfficial("passport", entries), { status: "invalid" });
});
