# Prikshit Kaswan’s Portfolio

A static portfolio for web development and data science. It includes project case studies, experience, technical skills, achievements, a printable résumé, and a contact form.

## Run locally

From the repository root, run:

```sh
python3 -m http.server 8765
```

Open [http://localhost:8765](http://localhost:8765/). No build step or package installation is required.

## Update the site

- Edit each page in its directory. Project case studies live under `work/`.
- Shared styles and interactions live in `assets/site.css` and `assets/site.js`.
- The contact form in `contact/index.html` submits to Formspree. Change the form’s `action` if you move to a different endpoint. Verify the destination inbox with a test submission after deployment.

## Deploy with GitHub Pages

In the repository’s **Settings → Pages**, select **Deploy from a branch**, then choose `main` and `/ (root)`. The project URL is `https://prikshit1929.github.io/Portfolio/` once Pages is enabled and the deployment succeeds.

If the project moves to a different URL, update the canonical URLs, sitemap, and links in `404.html`.
