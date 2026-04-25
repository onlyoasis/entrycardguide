---
title: "How to fill every field on the DR E-Ticket"
kicker: "Field-by-field walkthrough of the official DGM E-Ticket with common errors and what they mean. 8 minutes total."
description: "Step-by-step guide to every field on the Dominican Republic E-Ticket. Free and independent."
date: 2026-04-24
lastmod: 2026-04-24
country: "dominican"
weight: 20
---

{{< official-link site="dominican.eticket" >}}

This guide walks through every field the official E-Ticket asks, in the order the form presents them. Pre-check your entries below before pasting them into the DGM site.

{{< validator country="dominican" >}}

## Section 1: Traveler identity

### Passport number

The string printed next to "Passport No." on the photo page.

- **Format:** letters and digits, 6 to 12 characters. No spaces or dashes.
- **Do not use the MRZ.** The two long lines at the bottom of the photo page include check digits. Use the short number above them.

### Given name

Your first and middle names, exactly as on the passport.

- **Max 50 characters.**
- **Latin letters only.** The form rejects accented characters. Use the spelling from the MRZ line of your passport, which is always ASCII.

### Family name

Your surname.

- **Max 50 characters.**
- Keep hyphens if your passport has them.
- If you have two surnames on the passport (common for travelers from Spanish-speaking countries), include both, separated by a space.

### Nationality

Select the country that issued your passport from the dropdown.

- The dropdown is in Spanish first, English second. Both work.
- If you cannot find your country, try the Spanish name. `Estados Unidos` = USA, `Reino Unido` = UK, etc.

### Date of birth

Format: `YYYY-MM-DD`.

- `1991-08-22`, not `22/08/1991` and not `08-22-1991`.
- Use the date picker on mobile to avoid format errors.

## Section 2: Trip

### Flight or vessel number

Airline 2-letter IATA code + flight number, no space.

- `AA1234`, `DL567`, `JB91`.
- For cruise arrivals, use the ship's IMO or call sign as provided by the cruise line. If you do not have it, use the cruise line's booking number as a fallback and add a note in any free-text field.
- **Codeshare trap:** use the **operating** carrier's flight, not the marketing carrier's. The operating flight is what shows on the passenger manifest.

### Arrival date

Format: `YYYY-MM-DD`. The date you arrive in the DR.

- Use the date printed on your boarding pass for the DR segment, in DR local time.
- Red-eye trap: if you depart at 11pm on May 13 and land at 2am on May 14, your arrival date is `2026-05-14`.

### Departure date

Format: `YYYY-MM-DD`. The date you leave the DR.

- Approximate is OK for the form. You can update if it changes.
- Must be on or after the arrival date.

## Section 3: Stay and contact

### Address or hotel in DR

Where you will stay.

- **Max 200 characters.**
- Hotel name plus town or region is enough for tourism. `Bavaro Princess, Punta Cana` is fine.
- Airbnb: use the address the host confirmed.
- Staying at multiple places? Use your first night's address. The DGM does not require a full itinerary.

### Email

Your QR code is sent here.

- **Max 80 characters.**
- Use a monitored inbox. The QR is all you show at immigration, so losing the email is painful.
- If the email does not arrive within an hour, refile.

## Customs declaration

The E-Ticket wraps a short set of yes/no customs questions into the same form:

- Are you carrying more than $10,000 USD in cash or equivalent?
- Are you carrying commercial merchandise?
- Are you carrying plants, animals, or food products?
- Are you carrying weapons, ammunition, or explosives?

Answer truthfully. Honest "yes" answers route you to a secondary customs line, which is a 5 to 15 minute check, not a denial. Dishonest answers caught at screening result in fines and possible detention.

---

## What happens after you submit

1. The site shows a confirmation page with a QR code. Screenshot it.
2. An email arrives from `no-reply@migracion.gob.do` with a PDF attached containing the same QR.
3. At immigration on arrival at Punta Cana (PUJ), Las Américas (SDQ), Puerto Plata (POP), or any other DR port:
   - Show your passport.
   - Show the QR, from your phone or the PDF.
   - The officer scans the QR, stamps the passport, and you are through.
4. On departure, present the same QR again (or refile if you changed flights). The QR is valid for both entry and exit of the same trip.

## Common errors and what they mean

**"Número de pasaporte inválido"**
You included a space, a dash, or pasted from the MRZ. Use the short passport number from the photo page.

**"Fecha inválida"**
You used `MM/DD/YYYY` or `DD/MM/YYYY`. Use `YYYY-MM-DD` or the date picker.

**"Vuelo no válido"**
Flight number has a space, wrong airline prefix, or uses marketing vs operating carrier. Check your boarding pass.

**"Correo electrónico inválido"**
Trailing space or typo in the domain.

**No email after 1 hour**
Check spam. Refile if still missing. Duplicates are harmless.

**Border officer says "your E-Ticket is not in the system"**
Rare but documented. Show them the QR on your phone. If the QR will not scan, they can look up your record by passport number. The form is in the DGM system the moment you submit.
