import { existsSync, readFileSync } from "node:fs";

const requiredFiles = [
  "public/robots.txt",
  "public/sitemap.xml",
  "public/en/sitemap.xml",
  "public/zh/sitemap.xml",
];

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    throw new Error(`Missing required SEO output: ${file}`);
  }
}

const robots = readFileSync("public/robots.txt", "utf8");
for (const sitemap of [
  "https://entrycardguide.com/sitemap.xml",
  "https://entrycardguide.com/zh/sitemap.xml",
]) {
  if (!robots.includes(`Sitemap: ${sitemap}`)) {
    throw new Error(`robots.txt does not advertise ${sitemap}`);
  }
}

const rootSitemap = readFileSync("public/sitemap.xml", "utf8");
for (const sitemap of [
  "https://entrycardguide.com/en/sitemap.xml",
  "https://entrycardguide.com/zh/sitemap.xml",
]) {
  if (!rootSitemap.includes(`<loc>${sitemap}</loc>`)) {
    throw new Error(`root sitemap does not include ${sitemap}`);
  }
}

for (const file of ["public/en/sitemap.xml", "public/zh/sitemap.xml"]) {
  const sitemap = readFileSync(file, "utf8");
  if (!sitemap.includes("<urlset")) {
    throw new Error(`${file} is not a URL sitemap`);
  }
}

console.log("SEO output check passed");
