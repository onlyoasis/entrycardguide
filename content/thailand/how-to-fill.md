---
title: "How to Fill Thailand's Free TDAC Form (2026)"
kicker: "Field-by-field walkthrough of the official TDAC form with common errors and what they mean. 8 minutes total."
description: "Field guide to the Thailand Digital Arrival Card (TDAC): passport, flight, arrival date and contact fields, plus the errors that get it rejected. Free."
date: 2026-04-22
lastmod: 2026-10-23
country: "thailand"
weight: 20
layout: how-to-fill
---

{{< official-link site="thailand.tdac" >}}

This guide covers the TDAC fields people get wrong most often. The official form runs in three steps, Personal Information, Trip & Accommodation Information and Health Declaration, then a preview where you enter your email and submit. Field rules below were checked against the live form (version 2026.09.00) and the official user guide on 2026-10-15. Pre-check your entries with the tool below before you type them into the official site.

{{< validator country="thailand" >}}

## Section 1: Passport

Have your passport open to the photo page. Every value in this section comes off that one page. Copy it exactly. No creative spelling.

The site's **Retrieve with Passport** button can read the MRZ from a camera scan or an uploaded photo and fill in your name, passport number, nationality and date of birth. The official guide asks you to recheck everything it fills in.

### Passport number

The string printed next to "Passport No." or "Passport No./No. de passeport" on the photo page.

- **Letters and digits only, up to 20 characters.** No spaces, no dashes: if your passport prints `A 1234567`, type `A1234567`. Lowercase is fine; the site turns it into capitals.
- **Do not use the MRZ.** The two long strings at the bottom of the photo page (the machine-readable zone) include check digits that are not your passport number. Use the short number printed above them.
- A space or dash gets the form's "Invalid format." message.

### First name and middle name

- **First Name** is required: your given names, exactly as printed, in Latin letters. Max 60 characters, letters A–Z and spaces only.
- **Middle Name** is a separate box and optional, with the same rules. The site's own passport scan puts every given name into First Name and leaves Middle Name empty, so `JOHN QUINCY` in First Name is fine. Either way, type only the names printed on the photo page.
- **No accents, no diacritics, no non-Latin scripts.** `José` or `Müller` gets "Invalid format." Use the spelling in the passport's MRZ row, which is always ASCII: `JOSE`, `MUELLER` or however your MRZ writes it.
- Passports truncate long names. If yours is truncated on the passport, use the truncated version, not the full legal name.

### Family name

Your surname, exactly as printed on the passport. On the form it comes before First Name.

- **Required. Max 60 characters, letters A–Z and spaces only.**
- **No hyphens or apostrophes.** `SMITH-JONES` gets "Invalid format." Type `SMITH JONES`: the MRZ line writes it `SMITH<JONES`, with the same separator it uses between words.
- **No family name on your passport?** Type a single `-`. That is the form's own hint, and the passport scan does the same when it finds only one name, putting that name in First Name.
- **Suffixes** like `JR` or `III`: include them only if they appear on the passport.

### Date of birth

Three boxes, in this order: **year (yyyy), month (mm), day (dd).** Type or pick each value from the list that appears. The month and day boxes open once the year is in.

- `1991`, `08`, `22`. Not day first.
- The pre-check tool above takes the same date as `YYYY-MM-DD`.
- Date of birth cannot be changed with Update Arrival Card. If it is wrong, submit a new TDAC.

## Section 2: Trip

### Flight No./Vehicle No.

- **Required, up to 20 characters.** Spaces and ordinary punctuation are accepted, so `TG312` and `TG 312` both go through. Type it as your ticket shows it.
- Arriving by land: the vehicle number goes here. If you pick `OTHERS (PLEASE SPECIFY)` as Mode of Transport, you describe the transport in a text box instead (letters and spaces, up to 50 characters) and this box becomes optional.
- If your ticket shows a codeshare (e.g. "operated by Thai Airways, marketed as United UA7231"), use the **operating** carrier's flight number.
- Charter flights sometimes have 4-digit numbers with a letter suffix (e.g. `XL8842A`). Include the suffix.

### Arrival date

The date you actually land in Thailand, in Thailand local time. The form uses a date picker, and the box shows the date as `yyyy/mm/dd`. The tool above takes it the same way and flags a date outside the window.

- **Red-eye trap:** if you depart JFK at 11pm on May 12 and land in Bangkok at 1am on May 14 local time, your arrival date is May 14. Use the date printed on your boarding pass under the Bangkok (BKK) segment, not your departure date.
- **3-day window:** the arrival date box accepts today through 3 days ahead. If today is April 24 and you arrive May 14, come back on May 11 or later. A date outside that range gets "Invalid format."
- **Date of Departure** sits next to it and is optional.

## Section 3: Email and phone

These two are on different steps. The phone boxes are on the Personal Information page. The email comes last, after the preview.

### Email

After you review the preview, the form asks you to "specify an email to send Thailand Digital Arrival Card". It asks once per submission, so a group of up to 10 travelers gets one email. Pick an address you can open on the phone you will actually have in the airport.

- **Max 50 characters,** one address.
- **Use a real, monitored inbox.** We have seen travelers use throwaway addresses, lose the confirmation, and have to refile in the arrivals hall on airport wifi. Not fun.
- If the email does not arrive, check spam. The confirmation screen also has a PDF download of the card. The official FAQ says to contact the Immigration Officer at the entry checkpoint if the QR code email never came. You can also submit again: the system counts only the most recent submission.

### Phone

Required on the current form, in two boxes: **Code** and **Phone No.** Both take digits only.

- No `+`, spaces, dashes or brackets. A US number +1 415 555 0100 goes in as Code `1` and Phone No. `4155550100`.
- Code holds up to 10 digits, Phone No. up to 25.
- The Code fills in when you choose your Country/Territory of Residence. Change it if your phone number belongs to another country.
- Typed it wrong? See "Phone number typed wrong" below.

## Section 4: Health

The Health Declaration step asks for the countries or territories where you stayed within two weeks before arrival. The official user guide says the system asks for more only if one of those countries, the country where you boarded, your nationality or your flight is on the Ministry of Public Health's list. Then it asks:

- whether you have a Yellow Fever Vaccination Certificate, with the date of vaccination and an optional upload (JPG, JPEG, PNG or PDF, up to 5 MB);
- which symptoms from a list you have had in the past two weeks.

It may then tell you to go to the Department of Disease Control counter before the immigration checkpoint. Answer truthfully. The official FAQ says passengers who give incorrect information may be refused entry at immigration's discretion.

*Last checked against the official user guide and the live TDAC form: 2026-10-15. If the form has changed when you read this, trust the live site, not this page, and email us so we can update.*

## Occupation, residence, purpose and transport

Checked against the field rules in the live TDAC form (version 2026.09.00) on 2026-10-15. The option lists for Purpose of Travel and Mode of Transport load only after the site's human check, so this page does not copy them. The official user guide asks for every detail in English.

### Occupation

A free-text box on the Personal Information page, not a dropdown. It is required.

- English letters, spaces and ordinary punctuation. No digits.
- Max 100 characters. The site turns what you type into capitals.
- There is no list to match. Write the job in plain English: `TEACHER`, `NURSE`, `SOFTWARE ENGINEER`, `RETIRED`.

### Country/Territory of Residence

The country where you live now. It can differ from your passport: a Chinese citizen living in Singapore picks Singapore.

- A dropdown. Type three letters and matching countries appear, shown as `CODE: NAME`, for example `USA: THE UNITED STATES OF AMERICA`.
- Choose it before you type a phone number. It fills the phone Code box, and changing the country later clears both phone boxes and the city.

### City/State of Residence

Opens once the country is chosen. Required.

- Suggestions appear as you type. Pick one or type your own.
- Max 100 characters, no digits. The box accepts other scripts, but the guide asks for English: `SHANGHAI`, not `上海`.

### Purpose of Travel

A required dropdown on the Trip & Accommodation page.

- Choose the option that matches this trip.
- If none fits, choose `OTHERS (PLEASE SPECIFY)` and type the purpose in English. Letters and spaces only, max 100 characters.

### Mode of Travel and Mode of Transport

- **Mode of Travel** is required: how you cross into Thailand. The official guide covers arrivals by air, land and sea.
- **Mode of Transport** opens after it, and its list changes with the Mode of Travel you picked. Some choices open a text box for details.
- **Flight No./Vehicle No.** comes next, max 20 characters.

## Fixing a mistake after you submit

From the official user guide and FAQ, read 2026-10-15.

1. On tdac.immigration.go.th, click **Update Arrival Card**.
2. Search with your **TH Digital Arrival Card No.**, date of birth and nationality.
3. Correct the details, review them, enter your email, accept the terms and submit. Download the updated card; a copy also goes to your email.

- You can update any time before you travel.
- Full name, passport number, nationality and date of birth cannot be updated. If one of them is wrong, submit a new TDAC with the right details. The system counts the most recent submission as the valid one.
- Flight or hotel changed? Update the card or submit a new one before you enter Thailand.

### Phone number typed wrong

The official FAQ does not single out the phone number. It does say a submission must be accurate before entry, and that passengers with incorrect information may be refused entry at immigration's discretion. The phone number is not one of the locked fields, so correct it with Update Arrival Card.

---

## What happens after you submit

1. The official site shows a confirmation screen with a QR code. Screenshot it.
2. An email arrives within a few minutes from `no-reply@tdac.immigration.go.th`. It contains the same QR code as a PDF attachment.
3. At Bangkok (BKK), Suvarnabhumi (BKK), Don Mueang (DMK), Phuket (HKT), Chiang Mai (CNX), or any other international arrival, you walk up to immigration and show two things: your passport and the QR code. The officer scans the QR, stamps the passport, hands it back. Typical interaction is under 30 seconds.
4. You do not need to print the QR. The screenshot is fine. The PDF is fine. Even showing it from the email app is fine.

If the QR will not scan (rare, usually a glare issue), the officer can look up your record by passport number. The form is already in their system the moment you hit submit.

## Common errors and what they mean

The TDAC shows the same few messages under every box. These are the ones in the live form's code, plus two connection errors the official FAQ names.

**"This field is required."**
A required box is empty. Family Name counts: type `-` if your passport has none. Code and Phone No. are both required, and so is Flight No./Vehicle No. unless you chose `OTHERS (PLEASE SPECIFY)` as Mode of Transport.

**"Invalid format."**
The box got a character or a value it does not take. Common causes: a hyphen, apostrophe or accent in a name; a space or dash in the passport number; `+` or spaces in the phone boxes; more than 20 characters in Flight No./Vehicle No.; an email with a space or over 50 characters; an arrival date outside today to 3 days ahead.

**"Http failure response … 429 OK"**
The official FAQ lists this one after submitting and says refresh the page and try again.

**"Http failure response … 0 Unknown Error"**
The official FAQ says check that you are connected to the internet.

**No confirmation email**
Check spam, and download the card from the confirmation screen. The official FAQ says to contact the Immigration Officer at the entry checkpoint if the QR code email never arrived. A new submission is also allowed; the most recent one is the one that counts.
