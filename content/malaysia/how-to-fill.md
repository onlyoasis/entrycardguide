---
title: "How to fill every field on the Malaysia MDAC"
kicker: "Field-by-field walkthrough of the official Immigration Department MDAC with common errors and what they mean. 7 minutes total."
description: "Step-by-step guide to every field on the Malaysia Digital Arrival Card. Free and independent."
date: 2026-04-24
lastmod: 2026-04-24
country: "malaysia"
weight: 20
---

{{< official-link site="malaysia.mdac" >}}

This guide walks through every field the official MDAC asks, in the order the form presents them. Pre-check your entries below before pasting them into the official site.

{{< validator country="malaysia" >}}

## Section 1: Traveler identity

### Passport number

The string printed next to "Passport No." on the photo page.

- **Format:** letters and digits, 6 to 12 characters. No spaces or dashes.
- **Do not use the MRZ.** The two long lines at the bottom of the photo page include check digits. Use the short number above them.
- **Common error:** "Invalid passport number" usually means you included a space or pasted from the MRZ.

### Full name (as in passport)

**Single field.** The MDAC does not split given and family names. You type your entire name as it appears on the passport photo page.

- **Max 80 characters.**
- **Latin letters only.** Use the spelling from the MRZ line of your passport, which is always ASCII.
- **Order:** follow the order printed on your passport. For most Western passports, that is given names first, then family name. For some Asian passports, the order is family name first. Match what your passport prints, do not reorder.
- **Common mistake:** entering the name in the order the form seems to expect instead of the passport order. Match the passport.

### Nationality

Select the country that issued your passport from the dropdown.

- The list is in English and sorted alphabetically.
- Malaysia's immigration system differentiates several passport types (regular, official, diplomatic). For regular tourists, pick the regular option.

### Date of birth

Format: `YYYY-MM-DD`.

- `1991-08-22`, not `22/08/1991` and not `08-22-1991`.
- Use the date picker on mobile.

### Passport expiry date

Format: `YYYY-MM-DD`.

- Must be at least **6 months** after your planned arrival in Malaysia. This is a standard international immigration rule.
- If your passport expires sooner, you will be denied boarding by the airline before you even reach Malaysian immigration. Renew the passport first.

## Section 2: Trip

### Flight number

Airline 2-letter IATA code + flight number, no space.

- `MH123` (Malaysia Airlines), `AK456` (AirAsia), `SQ102` (Singapore Airlines), `EK343` (Emirates).
- **Codeshare trap:** use the **operating** carrier's flight. That is the one on the passenger manifest that Malaysian immigration sees.

### Arrival date

Format: `YYYY-MM-DD`. The date you arrive in Malaysia, in Malaysia local time.

- Must be within 3 days from today. The MDAC site rejects submissions outside this window.
- Red-eye trap: if you depart at 11pm May 13 and land at 2am May 14, your arrival date is `2026-05-14`.

### Port of entry

The Malaysian airport (IATA code) or land crossing.

- Airports: `KUL` (Kuala Lumpur International), `PEN` (Penang), `BKI` (Kota Kinabalu), `KCH` (Kuching), `JHB` (Johor Bahru), `LGK` (Langkawi), `TGG` (Terengganu).
- Land crossings from Thailand: `Bukit Kayu Hitam / Padang Besar / Wang Kelian`.
- Land crossings from Singapore: `Johor Bahru - Woodlands` or `Tuas - Tuas`.
- Sea entries: listed by name (`Pulau Langkawi Jetty`, `Penang Ferry Terminal`).

## Section 3: Stay in Malaysia

### Address in Malaysia

Where you will stay.

- **Max 200 characters.**
- Hotel name plus city is enough. `Mandarin Oriental Kuala Lumpur` works.
- Airbnb: use the address the host confirmed.
- Multiple places? Use your first night. No full itinerary required.

### Email

Where your MDAC confirmation is sent.

- **Max 80 characters.**
- Use a monitored inbox. Even though you do not strictly need to show the confirmation at immigration, having it on your phone is a safety net.

---

## What happens after you submit

1. The site shows a confirmation page with your MDAC reference number.
2. An email arrives from `no-reply@imi.gov.my` with the reference. There is usually no QR code; the reference number is the artifact.
3. At Malaysian immigration (KLIA, KLIA2, Penang, etc.):
   - Show your passport.
   - The officer scans your passport. Your MDAC submission is already linked in their system.
   - The officer stamps your passport and you are through. Most interactions are under 30 seconds.
4. You do not need to print or show the confirmation. But having the email open on your phone is smart in case their system has issues.

## Common errors and what they mean

**"Invalid passport number"**
You included a space, a dash, or pasted from the MRZ. Use the short passport number.

**"Invalid date of birth" / "Invalid passport expiry"**
You used `MM/DD/YYYY` or `DD/MM/YYYY`. Use `YYYY-MM-DD` or the date picker.

**"Passport not valid for travel"**
Your passport expiry is less than 6 months after your arrival date. You must renew before flying.

**"Arrival date out of range"**
You are submitting more than 3 days before arrival. Wait until within the window.

**"Flight not recognized"**
Space in the flight number, or you used a marketing carrier code on a codeshare. Check your boarding pass for the operating carrier.

**"Invalid email"**
Trailing space or typo in the domain.

**Site times out or hangs**
The MDAC site sometimes struggles during peak travel periods. Wait 10 to 15 minutes and retry. If it keeps failing, try a different browser or a different network.

**No confirmation email after 1 hour**
Check spam. Refile if still missing. Duplicates are harmless; the most recent submission applies.
