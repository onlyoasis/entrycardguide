---
title: "How to Fill Indonesia's e-CD: Field-by-Field Guide (2026)"
kicker: "Field-by-field walkthrough of the official Indonesia e-CD with common errors and what they mean. About 7 minutes total."
description: "Step-by-step 2026 guide to every field on Indonesia's official electronic Customs Declaration at ecd.beacukai.go.id. Free, no fees, Bali / Jakarta / all ports."
date: 2026-04-26
lastmod: 2026-04-26
country: "indonesia"
weight: 20
keywords: ["indonesia e-cd how to fill", "bali customs form fields", "indonesia customs declaration help", "ecd.beacukai.go.id fields"]
---

{{< official-link site="indonesia.ecd" >}}

This guide walks through every field the official e-CD form asks, in the order the form presents them. Pre-check your entries below before you paste them into the official site.

The form is in Indonesian and English on the same page (toggle in the upper right). The English version uses the same field order.

{{< validator country="indonesia" >}}

## Section 1: Traveler identity

### Passport number

The string printed next to "Passport No." on your passport photo page.

- Letters and digits, 6 to 12 characters. No spaces or dashes.
- **Do not use the MRZ.** The two long lines at the bottom of the photo page include check digits. Use the short number above them.
- Indonesian citizens use NIK (national ID number) instead of passport number. The form switches the field label automatically once you select Indonesian nationality.

### Full name (as in passport)

Single full-name field. Type your name as printed on the passport.

- Max 80 characters.
- Latin letters only. Use the spelling from the MRZ if your printed name has accented characters.
- Order: match what your passport prints. Don't reorder. Some passports print family-first; some given-first.

### Nationality

Select from the dropdown. The list is in English alphabetical order.

### Date of birth

Format: `YYYY-MM-DD`. The site uses a date picker on most browsers; if you paste, paste ISO format.

## Section 2: Trip

### Flight number or vessel number

Airline 2-letter IATA code + flight number, no space.

- `GA456` (Garuda Indonesia), `AK788` (AirAsia), `JT123` (Lion Air), `SQ32` (Singapore Airlines).
- For cruise arrivals, use the ship's IMO or the cruise booking number.
- **Codeshare trap**: use the **operating** carrier's flight, not the marketing carrier's. The operating flight is what shows on the passenger manifest that Indonesian customs sees.

### Arrival date

Format: `YYYY-MM-DD`. The date you land in Indonesia, in **Indonesia local time** (Jakarta time, WIB).

- Bali (DPS) is in Central Indonesia time (WITA), one hour ahead of Jakarta. Use Jakarta time for the form regardless.
- Red-eye trap: if you depart Singapore at 11pm and land in Bali at 1am, your arrival date is the next day.

### Port of entry

Indonesian airport (IATA code) or named seaport.

- `CGK` (Jakarta / Soekarno-Hatta), `DPS` (Bali / Ngurah Rai), `SUB` (Surabaya), `BPN` (Balikpapan), `KNO` (Medan / Kualanamu), `UPG` (Makassar), `BTH` (Batam).
- Seaports listed by name: `Tanjung Priok`, `Benoa Bali`, etc.

### Number of family members traveling together

The e-CD supports family bundling. One adult fills the form for the whole family. Each additional person adds a section to the same submission.

- Max 8 family members per form. For larger groups, file separate forms per family unit.
- Each person gets listed by name and passport (or NIK for Indonesians).

## Section 3: Stay in Indonesia

### Address in Indonesia

Where you will stay first night.

- Max 200 characters.
- Hotel name + street + neighborhood + city is plenty: `Hotel Example, Jl. Sunset Road No. 89, Kuta, Badung, Bali`.
- Airbnb: use the address the host provided.
- Multi-city trips: just first night. No full itinerary required.

### Email

Where the QR code is sent.

- Max 80 characters.
- Use a monitored inbox. The QR is the artifact you show at customs; losing the email is painful.

## Section 4: Customs declaration

This is the actual customs part. Five yes/no questions:

### Are you carrying more than IDR 100,000,000 (about $6,500 USD) in cash or equivalent?

If yes, you must declare it at customs and complete a separate cash transport form. Carrying high amounts of cash is legal but undeclared cash above the limit is confiscable.

### Are you carrying commercial merchandise?

Goods for resale. If yes, you'll be routed to the commercial customs lane and may owe duty.

### Are you carrying restricted items?

Drugs, weapons, ammunition, plants, animals, raw food. **Even prescription medication may need declaration** if you're carrying large quantities or controlled substances. Check with the Indonesian embassy if unsure.

### Are you carrying excise goods above duty-free limits?

Alcohol > 1 liter, tobacco > 200 cigarettes / 25 cigars / 100g loose tobacco, perfume > 350 ml.

### Have you visited any African or South American country in the past 30 days?

This is yellow-fever screening. If yes, you may be asked to show a yellow-fever vaccination certificate at customs.

**Answer truthfully.** Honest "yes" answers route you to a secondary lane (5-15 minute check, not a denial). Dishonest answers caught at screening result in fines and possible detention.

---

## What happens after you submit

1. The site shows a confirmation page with a QR code. **Screenshot it.**
2. An email arrives from `no-reply@beacukai.go.id` with the same QR attached as a PDF.
3. At immigration in Indonesia:
   - Most travelers go through a fast green-lane: scan QR at the customs gate, walk through.
   - If you answered "yes" to any customs question, the QR routes you to the red lane for the secondary check.
4. The QR is single-use. If you re-enter Indonesia later, file a new e-CD for that trip.

## Common errors and what they mean

**"Invalid passport number"**
You included a space, a dash, or pasted from the MRZ. Use the short passport number from the photo page.

**"Invalid date of arrival"**
You used `MM/DD/YYYY` or `DD/MM/YYYY`. Use the date picker, or paste `YYYY-MM-DD`.

**"Flight number not recognized"**
Most often: codeshare carrier mismatch. Check your boarding pass for the operating carrier code. Sometimes the form rejects perfectly valid flights from smaller airlines; in that case, type the flight manually instead of selecting from the dropdown.

**"Email already submitted for this date"**
You filed for the same arrival date already and the system has a record. Open the existing record by passport number — you can update it instead of refiling.

**No QR after 1 hour**
Check spam first. The Indonesian customs server occasionally drops emails to certain domains (Outlook.com has reported issues). Try refiling with a Gmail address as backup.

**QR scan fails at the airport**
Rare. The customs gate has a manual lookup option; show the officer your passport and they can find your record. Also keep the email PDF as a fallback.

**Family member added but their name shows as "TBD"**
You skipped a required field for that person. Open their section, fill all required fields, save again. The form lets you partially save and return.
