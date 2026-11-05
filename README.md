# CrossRoad Driving School website

Static site (HTML, CSS, JS). No build step.

## Before going live
1. Open `js/config.js` and set your real phone/WhatsApp number and email. They update on every page.
2. After deploying, change the `og:image` URL in each page's `<head>` to the full address of `assets/og-image.jpg` (needed for link previews on WhatsApp/Facebook).

## Deploy on GitHub Pages
1. Create a repository and upload everything in this folder (so `index.html` is at the top level).
2. Repository Settings > Pages > Source: "Deploy from a branch", branch `main`, folder `/ (root)`.
3. Your site appears at `https://<username>.github.io/<repository>/`.

## Files
- `index.html`, `services.html`, `areas.html`, `contact.html`
- `css/styles.css`, `js/main.js`, `js/config.js`
- `assets/` logos (`logo-light.png` for white backgrounds, `logo-dark.png` for dark backgrounds), favicon, share image
