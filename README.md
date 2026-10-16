# Raymond Link

A Supabase-inspired personal workspace for raymondlink.com. Static HTML, CSS, and JavaScript, generated with Node. No third-party dependencies or package installation needed.

## Open without a server

Open `preview.html` directly in your browser. It has embedded styles and scripts; keep it alongside the `public/` folder so the résumé link works. Regenerate it after edits with `npm run preview:file`.

## Run locally

```sh
npm run dev
```

Open http://localhost:4321. Leave the server running while you edit: changes in `src/`, `public/`, and `scripts/` automatically rebuild the site and refresh open browser tabs. Build errors appear in the terminal; fix the file and save to retry. Press Ctrl+C to stop.

Use `npm run preview` to build and serve without watching or automatic refresh. Live refresh is only injected by the dev server; production files stay unchanged.

## Build for hosting

```sh
npm run build
```

Upload `dist/` to any static host (Cloudflare Pages, GitHub Pages, Netlify, or Sites). Configure the custom domain in your selected host and use its exact DNS instructions. No DNS changes have been made by this project.

## Edit your content

`src/data/profile.mjs` contains the biography, contact links, engineering work, skills, and blank slots for personal projects and websites. Add a title, description, and full `https://` URL to turn a slot into a clickable card. Missing URLs stay non-clickable. The file supports any number of entries, including an empty array.

Replace `public/raymond-link-resume.pdf` to update the résumé. Update the résumé date in `src/site.mjs` when replacing it. The full original PDF is downloadable, including the contact information in that document.

- Layout and sections: `src/site.mjs`
- Colors, spacing, and responsive styles: `src/styles/site.css`
- Navigation, theme, search, and copy-email behavior: `src/client.js`
- Build: `scripts/build.mjs`
- Static preview server: `scripts/serve.mjs`

The site defaults to dark mode, remembers a chosen color theme locally, and supports Ctrl/Cmd+K search. On mobile the sidebar is an off-canvas drawer.
