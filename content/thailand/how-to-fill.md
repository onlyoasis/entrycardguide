---
title: "How to fill every field on the Thailand TDAC"
kicker: "Field-by-field walkthrough of the official TDAC form with common errors and what they mean. 8 minutes total."
description: "Step-by-step guide to every field on the Thailand Digital Arrival Card (TDAC). Free and independent."
date: 2026-04-22
lastmod: 2026-04-22
country: "thailand"
weight: 20
---

{{< official-link site="thailand.tdac" >}}

This guide walks through every field the official TDAC asks for, in the order the form presents them. Pre-check your entries with the tool below before you paste them into the official site.

{{< validator country="thailand" >}}

## Section 1: Passport

Have your passport open to the photo page. Every value in this section comes off that one page. Copy it exactly. No creative spelling.

### Passport number

The string printed next to "Passport No." or "Passport No./No. de passeport" on the photo page. Usually 6 to 9 characters. Almost always starts with a letter.

- **Format:** `^[A-Z][A-Z0-9]{5,8}$` — one uppercase letter, then 5 to 8 letters or digits.
- **No spaces, no dashes.** If your passport prints `A 1234567`, type `A1234567`.
- **Do not use the MRZ.** The two long strings at the bottom of the photo page (the machine-readable zone) include check digits that are not your passport number. Use the short number printed above them.
- **Common error:** "Invalid passport number" usually means you included a space, pasted from the MRZ, or used a lowercase letter. The official site uppercases for you, but the validator below flags it early so you notice.

### Given name

Your first and middle names, exactly as printed on the passport, in Latin letters.

- **Max 40 characters.** Passports truncate long names. If yours is truncated on the passport, use the truncated version, not the full legal name.
- **No accents, no diacritics, no non-Latin scripts.** If your passport shows both a native-script name and a Latin transliteration, use the Latin one. The TDAC will not accept `José` or `Müller` even if that is how your name is spelled at home. Use the spelling in the passport's MRZ row, which is always ASCII.
- **Middle names:** include them in this field, separated by a single space, only if they appear on the passport photo page. If your passport says `JOHN QUINCY`, type `JOHN QUINCY`. If it says `JOHN Q`, type `JOHN Q`.

### Family name

Your surname, exactly as printed on the passport.

- **Max 40 characters.**
- **Hyphenated names:** keep the hyphen. `SMITH-JONES` stays `SMITH-JONES`.
- **Suffixes** like `JR` or `III`: include them only if they appear on the passport.
- If your family name field on the passport is blank (some countries issue passports with a single name in the given-name field), repeat the given name here. Thai immigration has accepted this at the counter for years.

### Date of birth

Format: `YYYY-MM-DD`. This is the single most common place people get rejected.

- `1991-08-22`, not `08/22/1991`, not `22-08-1991`.
- The official site uses a date picker on desktop and a native date input on mobile. The picker hides the format question, but if you paste, paste ISO format.
- **Common error:** "Invalid date" almost always means you used the US format `MM/DD/YYYY` or the EU format `DD/MM/YYYY`. The validator below catches this.

## Section 2: Trip

### Flight number

Airline 2-letter IATA code, then the flight number, no space.

- `TG312`, not `TG 312` and not `THAI312`.
- If your ticket shows a codeshare (e.g. "operated by Thai Airways, marketed as United UA7231"), use the **operating** carrier's flight number. That is the one immigration sees on the passenger manifest.
- Charter flights sometimes have 4-digit numbers with a letter suffix (e.g. `XL8842A`). Include the suffix.
- **Common error:** "Flight not found" almost never means the form actually validates against a flight database. It usually means you typed a space or the wrong airline code. Re-check your boarding pass.

### Arrival date

Format: `YYYY-MM-DD`. The date you actually land in Thailand, in Thailand local time.

- **Red-eye trap:** if you depart JFK at 11pm on May 12 and land in Bangkok at 1am on May 14 local time, your arrival date is `2026-05-14`. Use the date printed on your boarding pass under the Bangkok (BKK) segment, not your departure date.
- **3-day window:** the official site rejects submissions more than 3 days before arrival. If today is April 24 and you arrive May 14, come back on May 11 or later. The validator below will warn you, but the official site is the one that enforces.

## Section 3: Contact

### Email

Where your confirmation and QR code arrive. This is the only thing you show at immigration. Pick an address you can open on the phone you will actually have in the airport.

- **Max 80 characters.**
- **Use a real, monitored inbox.** We have seen travelers use throwaway addresses, lose the confirmation, and have to refile in the arrivals hall on airport wifi. Not fun.
- If the confirmation does not arrive in an hour, check spam, then refile. The official site is idempotent. Duplicate submissions are harmless and the latest one applies.

### Phone

Optional. Include the country code with a `+`.

- `+1 415 555 0100` or `+14155550100`, both accepted.
- Used only if immigration needs to reach you. Most travelers never get a call. Fill it if you have a travel SIM or eSIM active on arrival, skip it if you do not.

## Section 4: Health

Thailand's health declaration is currently a short set of yes/no questions about recent travel to countries with active outbreak advisories and any current symptoms. The questions change with public health policy, so we do not list them field-by-field here. They are written in plain English on the official site and take about 30 seconds.

- Answer truthfully. Lying on a Thai health declaration is a separate offense from lying on the arrival card.
- If you answer "yes" to any symptom question, you will be routed to a secondary health screening on arrival. This is not a denial of entry. It is a 5 to 15 minute check.

*Last reviewed against the live TDAC site: 2026-04-22. If the section has changed when you read this, trust the live site, not this page, and email us so we can update.*

---

## What happens after you submit

1. The official site shows a confirmation screen with a QR code. Screenshot it.
2. An email arrives within a few minutes from `no-reply@tdac.immigration.go.th`. It contains the same QR code as a PDF attachment.
3. At Bangkok (BKK), Suvarnabhumi (BKK), Don Mueang (DMK), Phuket (HKT), Chiang Mai (CNX), or any other international arrival, you walk up to immigration and show two things: your passport and the QR code. The officer scans the QR, stamps the passport, hands it back. Typical interaction is under 30 seconds.
4. You do not need to print the QR. The screenshot is fine. The PDF is fine. Even showing it from the email app is fine.

If the QR will not scan (rare, usually a glare issue), the officer can look up your record by passport number. The form is already in their system the moment you hit submit.

## Common errors and what they mean

**"Invalid passport number"**
You included a space, a dash, or a lowercase letter, or you pasted from the MRZ at the bottom of the passport photo page instead of the short number above it.

**"Date rejected" or "Invalid date format"**
You used `MM/DD/YYYY` or `DD/MM/YYYY`. The TDAC wants `YYYY-MM-DD`. On mobile, tap the date field and use the native picker to avoid typing format mistakes entirely.

**"Arrival date out of range"**
You are submitting more than 3 days before arrival, or your arrival date is more than 18 months out. Wait until you are inside the 3-day window.

**"Email format invalid"**
You have a trailing space, a missing `@`, or a typo in the domain (`gmial.com` is the classic).

**"Flight number not recognized"**
You used the marketing carrier's code on a codeshare, added a space, or mistyped the airline prefix. Check your boarding pass for the operating carrier.

**"Name contains invalid characters"**
You typed an accented character or a non-Latin script. Use the Latin spelling from the MRZ line of your passport, which is always ASCII.

**No confirmation email after 1 hour**
Check spam. If still missing, refile. Duplicate submissions are harmless. The most recent one is the one that counts.
