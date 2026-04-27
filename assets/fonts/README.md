# Fonts

The site currently uses system font stacks from `tailwind.config.js`.

Do not add `@font-face` or font preload tags unless the WOFF2 files are also
committed and copied into the build output. The SEO check verifies local
assets referenced from generated HTML, so missing `/fonts/*.woff2` references
will fail CI.

If self-hosted fonts are reintroduced later, place the files under
`static/fonts/` so Hugo copies them to `public/fonts/`, then add the matching
license files.
