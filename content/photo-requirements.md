---
title: "Visa and entry form photo requirements by country"
kicker: "Which official forms ask for a photo, the published size and file limits, and a tool that resizes your photo in this browser. The free arrival cards listed here ask for no face photo."
description: "Official photo rules for the Vietnam e-Visa (4 × 6 cm, under 2 MB), India e-Visa (square JPEG, 10 KB to 1 MB), NZeTA, UK ETA, Laos, Uzbekistan, Tanzania and more, with a free tool that crops and compresses your photo without uploading it."
date: 2026-10-15
layout: tool
eyebrow: "Reference and tool · runs in your browser"
faq:
  - q: "Do arrival cards like TDAC or MDAC need a photo?"
    a: "No. The official TDAC, MDAC and All Indonesia forms ask for no face photo and no passport image. If a site asks you to upload one for these cards, it is not the government form."
  - q: "Which forms need a photo upload?"
    a: "E-visas and travel authorisations. This page lists file uploads for Vietnam, India, Laos, Russia, Uzbekistan, Tanzania, Morocco, Oman, Myanmar, Georgia, Ethiopia, Brazil, Nepal, Kenya, the UK ETA online form and the NZeTA. Australia's ETA and the ESTA app take the face photo live inside the app."
  - q: "What size is the Vietnam e-Visa photo?"
    a: "4 × 6 cm, JPG or JPEG, under 2 MB, white background, no hat and no glasses. That is the wording on evisa.gov.vn, checked on 15 October 2026."
  - q: "What size is the India e-Visa photo?"
    a: "A square JPEG between 10 KB and 1 MB. The passport bio page is uploaded separately as a PDF between 10 KB and 300 KB."
  - q: "Can I edit the photo to fix the background?"
    a: "No. New Zealand refuses photos changed with AI or editing tools, including brightness, contrast and a cut-out background, and the UK refuses photos altered by software. Retake the photo against a plain wall. Cropping and resizing are fine."
  - q: "Is my photo uploaded when I use the tool?"
    a: "No. This browser tab decodes, crops and compresses the photo. The tool makes no network request and records nothing. Close the tab and the photo is gone."
---

Most free arrival cards ask for no photo at all. Thailand's TDAC, Malaysia's MDAC and All Indonesia are typed forms with no upload step. Photos come in with e-visas and travel authorisations, and each government sets its own size, file limit and format.

If a site asks for your face photo to file a free arrival card, you are not on the government form.

{{< photo-tool >}}

## Photo rules by form

Each row comes from the country file in [`data/photo_specs`](https://github.com/onlyoasis/entrycardguide/tree/main/data/photo_specs). Only published numbers appear. "Not published" means the official page gives none. The date links to the page the rule was read from.

{{< photo-specs >}}

## Forms with no photo upload

These official forms ask for no face photo and no passport image. A site that asks you to upload one for them is not the government form.

{{< photo-specs show="none" >}}

Forms not on this page have not been reviewed for photos yet. The official form screen is the authority.

## What the tool does, and what it will not do

- It crops to the published shape, resizes into the published pixel range, and lowers JPEG quality until the file fits the size limit. For the India e-Visa passport page it saves a one-page PDF.
- It writes a pixel density into the JPEG, so a 4 × 6 cm or 35 × 45 mm rule prints at that size.
- It does not change colours, brightness, the background or your face. New Zealand and the UK refuse edited photos, and a cut-out background is one of the edits New Zealand names.
- It cannot see whether your background is white or your eyes are open. Read the note for your form before you take the photo.
- Chrome and Firefox cannot open iPhone HEIC files. Export a JPG first, or use Safari.

## Questions

### Do arrival cards like TDAC or MDAC need a photo?

No. The official TDAC, MDAC and All Indonesia forms ask for no face photo and no passport image. If a site asks you to upload one for these cards, it is not the government form.

### Which forms need a photo upload?

E-visas and travel authorisations. This page lists file uploads for Vietnam, India, Laos, Russia, Uzbekistan, Tanzania, Morocco, Oman, Myanmar, Georgia, Ethiopia, Brazil, Nepal, Kenya, the UK ETA online form and the NZeTA. Australia's ETA and the ESTA app take the face photo live inside the app.

### What size is the Vietnam e-Visa photo?

4 × 6 cm, JPG or JPEG, under 2 MB, white background, no hat and no glasses. That is the wording on evisa.gov.vn, checked on 15 October 2026.

### What size is the India e-Visa photo?

A square JPEG between 10 KB and 1 MB. The passport bio page is uploaded separately as a PDF between 10 KB and 300 KB.

### Can I edit the photo to fix the background?

No. New Zealand refuses photos changed with AI or editing tools, including brightness, contrast and a cut-out background, and the UK refuses photos altered by software. Retake the photo against a plain wall. Cropping and resizing are fine.

### Is my photo uploaded when I use the tool?

No. This browser tab decodes, crops and compresses the photo. The tool makes no network request and records nothing. Close the tab and the photo is gone.
