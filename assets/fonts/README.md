# Fonts

Self-hosted WOFF2 only. No Google Fonts CDN (privacy positioning — no third-party leak).

## Required files

Download and place in this directory:

### 1. Fraunces (variable, all features)
```
Fraunces-VariableFont_SOFT,WONK,opsz,wght.woff2
```
Source: https://fonts.google.com/specimen/Fraunces → Download family → extract WOFF2

Or from GitHub: https://github.com/undercasetype/Fraunces/releases

### 2. Instrument Sans (variable)
```
InstrumentSans-VariableFont_wdth,wght.woff2
```
Source: https://fonts.google.com/specimen/Instrument+Sans → Download family

### 3. Geist Mono (variable)
```
GeistMono-VariableFont_wght.woff2
```
Source: https://vercel.com/font → Geist Mono → WOFF2

## Licensing

- Fraunces: SIL Open Font License (free commercial use)
- Instrument Sans: SIL Open Font License
- Geist Mono: SIL Open Font License

Include the license files in this directory alongside the font files for attribution.

## Verifying no CDN leak

After `hugo --gc --minify`, check `public/` does NOT contain any reference to `fonts.googleapis.com` or `fonts.gstatic.com`:

```bash
grep -r "fonts.g" public/ && echo "LEAK" || echo "CLEAN"
```
