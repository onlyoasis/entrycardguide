---
title: "How to Fill the Turkey e-Visa: All 18 Fields (2026)"
kicker: "Five sections and 18 fields for travellers whose passports actually require an e-Visa."
description: "How to fill the Turkey e-Visa: all 18 eligibility, applicant, passport, contact, and conditional supporting-document fields in order."
date: 2026-07-14
lastmod: 2026-07-20
country: "turkey"
weight: 20
keywords: ["how to fill Turkey e-Visa", "Turkey eVisa fields", "Turkey eVisa application", "evisa.gov.tr", "Turkey eVisa supporting document"]
layout: how-to-fill
---

First confirm that your passport needs a Turkey e-Visa before continuing.

{{< official-link site="turkey.mfa_visa_info" >}}

If the MFA page says your passport is visa-exempt for this trip, there is no form to complete. If it directs you to the e-Visa system, use only the government application site.

{{< official-link site="turkey.evisa" >}}

The local checker reads the 18 rules in `data/rules/turkey.json`. It runs in your browser and sends nothing to us. The live government flow decides exemption, eligibility, conditions, and price.

{{< validator country="turkey" >}}

## Section 1: Eligibility

1. **Nationality or region of travel document:** choose what is printed on the passport used for the trip, not your residence or departure country. This answer controls visa exemption, eligibility, conditions, and fee.
2. **Travel document type:** select the exact type, such as Ordinary Passport. Do not guess from the cover colour. Ordinary and official passports can follow different rules.
3. **Arrival date in Türkiye:** enter the planned first arrival date. This local checker uses `YYYY-MM-DD`. Do not enter the flight departure date.

The official flow can stop here with a visa-exempt result. If it does, do not continue to payment.

## Section 2: Applicant

4. **Given or first name(s):** copy every given name in passport order, including middle given names. The documented maximum is 50 characters.
5. **Surname(s):** copy the passport surname without a title such as Mr or Ms. Leave it blank only when the passport has no surname. Maximum 50 characters.
6. **Date of birth:** match the passport date. This checker uses `YYYY-MM-DD` and rejects a future date.
7. **Place of birth:** copy the passport entry, including the city rather than replacing it with a country. Maximum 40 characters.
8. **Mother's name:** enter all requested names. Leave it blank only when the official flow permits that. Maximum 40 characters.
9. **Father's name:** follow the same rule. Do not shorten a multi-part name. Maximum 40 characters.

For names and place of birth, use Latin letters, spaces, hyphens, or apostrophes. Do not add punctuation that is absent from the passport.

## Section 3: Travel document

10. **Travel document number:** copy the number with capital letters and digits only. Do not include spaces or the `<` filler marks from the machine-readable zone. Maximum 16 characters.
11. **Travel document issue date:** match the issue date on the document. This checker uses `YYYY-MM-DD`; it cannot be after July 14, 2026.
12. **Travel document expiry date:** copy the expiry date, then check the live eligibility result. Türkiye generally requires validity at least 60 days beyond the permitted stay, and the result can impose more.

Use the same travel document for the application and the trip. A number or expiry date copied from an old passport will not match the issued e-Visa.

## Section 4: Contact

13. **Email:** use a lowercase inbox you control. Payment and e-Visa download links go there. The documented maximum is 40 characters.
14. **Phone number:** include the country or region code. The checker accepts an international number with 7 to 15 digits; the documented display maximum is 20 characters.
15. **Residence address:** enter the applicant's current home address, not the hotel in Türkiye. Maximum 200 characters including spaces.

Check the email spelling before submission. A valid e-Visa stored in an intermediary's inbox is harder to retrieve and verify.

## Section 5: Conditional eligibility

Complete fields 16 to 18 only when the official result requires a supporting visa or residence permit.

16. **Supporting document type:** choose the document actually held, either the visa or residence permit requested by the official result.
17. **Supporting document issuing country or area:** select the issuer shown on the supporting document. Current country rules commonly refer to Schengen, the United States, the United Kingdom, or Ireland.
18. **Supporting document expiry date:** enter it when the document has one, using `YYYY-MM-DD`, and confirm it remains valid under every condition on the result page.

Do not fill these fields with an expired document or select an issuer just to unlock the next screen. If the conditions are not met, the online e-Visa route is not available for that application.

## After submission

Save the application reference, payment receipt, email, and issued e-Visa PDF. Check the name, travel-document number, and validity before travel. Carry the e-Visa and the same passport used in the application.
