---
title: "How to fill every field on the Mexico FMM-E"
kicker: "Field-by-field walkthrough of the official INM form with common errors and what they mean. 10 minutes total."
description: "Step-by-step guide to every field on Mexico's Forma Migratoria Múltiple Electrónica. Free and independent."
date: 2026-04-24
lastmod: 2026-04-24
country: "mexico"
weight: 20
---

{{< official-link site="mexico.fmm" >}}

This guide walks through every field the official INM FMM-E form asks, in the order the form presents them. Pre-check your entries with the tool below before pasting them into the INM site.

{{< validator country="mexico" >}}

## Section 1: Traveler identity

### Passport number

The string printed next to "Passport No." on your passport photo page.

- **Format:** letters and digits, 6 to 12 characters, no spaces or dashes.
- **Do not use the MRZ.** The two long lines at the bottom of the photo page are the machine-readable zone and include check digits. Use the short number above them.
- **Common error:** "Número de pasaporte inválido" usually means you included a space or used a character the INM form does not accept. Remove spaces, retry.

### Given name (Nombre)

Your first and middle names, exactly as shown on the passport.

- **Max 50 characters.**
- **Latin letters only.** The INM form rejects accented characters and non-Latin scripts. Use the spelling from the MRZ line of your passport, which is always ASCII.
- If your passport shows both a native-script name and a Latin transliteration, use the Latin one.

### Family name (Apellidos)

Your surname. In Spanish-speaking countries, people use two last names (paternal + maternal). If your passport lists both, include both, separated by a space. If your passport lists only one, use that.

- **Max 50 characters.**
- **Hyphenated names:** keep the hyphen exactly as on the passport.

### Nationality

The country that issued your passport, as an ISO 3-letter code.

- `USA`, `CAN`, `GBR`, `FRA`, `DEU`, `JPN`, etc.
- The INM form also shows the full country name in Spanish in a dropdown. Either works. If you search, searching in Spanish is more reliable: `Estados Unidos` finds the USA option faster than typing "United States."

### Date of birth

Format: `YYYY-MM-DD`. The INM site uses a date picker on most browsers, but if you paste, paste ISO format.

- `1991-08-22`, not `22/08/1991` and not `08-22-1991`.
- **Common error:** "Fecha inválida" almost always means you used the US `MM/DD/YYYY` format. Mexico uses `DD/MM/YYYY` in everyday life, but the INM form accepts `YYYY-MM-DD` via its picker.

## Section 2: Trip

### Arrival date

Format: `YYYY-MM-DD`. The date you actually enter Mexico.

- For air arrivals, use the date printed on your ticket for the Mexico segment.
- For land crossings, use the date you plan to cross. If that slips by a day, you can file again or update at the border.

### Port of entry

The airport (IATA code) or land crossing point.

- Airports: `MEX` (Mexico City), `CUN` (Cancún), `GDL` (Guadalajara), `TIJ` (Tijuana), `PVR` (Puerto Vallarta), `SJD` (Los Cabos), etc.
- Land crossings: the INM dropdown lists each by name (e.g. `San Ysidro / Tijuana`, `Laredo / Nuevo Laredo`).
- Sea ports: listed by name (`Cozumel`, `Progreso`, etc).

If you arrive at a port not in the dropdown, you almost certainly do not need an FMM-E: check the [overview page](/mexico/fmm/) for which entries use passport stamps instead.

### Purpose of trip

Select one. The options are usually:

- **Tourism** — most visitors.
- **Business** — attending meetings, conferences, but not working for a Mexican employer.
- **Transit** — passing through Mexico without staying.
- **Study** — enrolled in a short course. Longer study requires a separate student visa.
- **Other** — free-text field appears if you pick this.

If you are unsure, pick tourism. The difference mostly affects the days authorized on the stamp, not whether you are admitted.

## Section 3: Stay in Mexico

### Address in Mexico

Where you will stay.

- **Max 200 characters.**
- Hotel name plus city is enough for tourism.
- Example: `Hotel Xcaret Mexico, Carretera Chetumal-Puerto Juarez Km 282, Playa del Carmen, Quintana Roo`.
- If you are staying at multiple places, use your first night's address. The INM does not require a full itinerary.
- Airbnb is fine. Use the address the host provided in your booking confirmation.

### Email

Where your FMM-E PDF is sent. Use a monitored inbox.

- **Max 80 characters.**
- Confirmation arrives within minutes. If not in an hour, check spam, then refile.
- The PDF contains a reference number. Keep it. You may need it at the border.

---

## What happens after you submit

1. The INM site shows a confirmation with your reference number. Screenshot it.
2. An email arrives with the FMM-E PDF attached.
3. At the border:
   - **Air:** the airline may ask for the PDF at check-in. At arrival, the officer scans your passport, may ask for the reference number, stamps your passport, and hands back a stub.
   - **Land:** approach the INM desk (usually just past the customs check). Show the PDF. The officer stamps it, tears off a stub, and hands it back.
4. **Keep the stub** until you exit Mexico. You surrender it on exit. Losing it means a small replacement fee.

## Common errors and what they mean

**"Número de pasaporte inválido" / "Invalid passport number"**
You included a space, a dash, or pasted from the MRZ. Use the short passport number from the photo page.

**"Fecha inválida" / "Invalid date"**
You used `MM/DD/YYYY` or `DD/MM/YYYY`. Use the date picker, or paste `YYYY-MM-DD`.

**"Nacionalidad no encontrada" / "Nationality not found"**
You typed the country name in English but searched in Spanish. Try the 3-letter code (`USA`, `CAN`, `GBR`).

**"Correo electrónico inválido"**
Email format wrong. Check for trailing space or typo in the domain.

**"No se pudo generar el formato"**
INM server issue, usually transient. Wait 5 minutes, try again. If it persists, try a different browser; the INM site has occasional Safari compatibility issues.

**No email after 1 hour**
Check spam. If still missing, refile. Duplicate submissions are harmless. Border officers resolve dupes by taking the most recent.
