# INCAR AUTO PARTS

INCAR AUTO PARTS is a specialized B2B auto parts supplier serving wholesalers and importers across the Middle East from China.

## Brand Identity

- Brand name: INCAR AUTO PARTS
- Short brand name: INCAR
- Positioning: B2B Auto Parts Supplier for Middle Eastern Markets
- Extended positioning: Specialized Auto Parts Supplier from China for the Middle East
- Core workflow: RFQ-led B2B supply

## Business Focus

Customers deal commercially with INCAR. INCAR reviews requirements, selects factories and manufacturing sources internally, performs pricing analysis, issues quotations under the INCAR name, and manages the agreed specifications, production, quality-control checkpoints, packaging, and supply follow-up.

The website supports product discovery, local RFQ drafts, supply-service review, and private label requirements for Middle Eastern markets. It is not a marketplace, factory directory, broker, translator, or customer-to-factory connection service. Factory names and contacts remain backstage unless a later approved business process explicitly requires otherwise.

Toyota and Hyundai makes and models currently form an initial browsing structure only. They do not establish published products, catalogs, inventory, availability, or quotation readiness.

## Local Development

### Requirements

- Node.js `20.9.0` or newer. The installed Next.js version declares this minimum in `node_modules/next/package.json`.
- npm. This project includes `package-lock.json`, so npm is the expected package manager.
- VS Code or another code editor.

### Install Dependencies

Run this once after opening the project folder:

```bash
npm install
```

### Run The Development Server

Use the Next.js development server for normal local work:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

This is the main local preview URL for development.

Sample products and catalogs are hidden by default. They can be exposed only during local development by setting `NEXT_PUBLIC_ENABLE_SAMPLE_DATA=true`; production builds ignore this flag.

### Build For Production

```bash
npm run build
```

The MVP uses the dynamic Next.js App Router for Vercel. It does not use static export and does not require an `out/` directory.

Set `NEXT_PUBLIC_SITE_URL` in the deployment environment to the public site origin used by canonical URLs, hreflang, the sitemap, and robots metadata. Local development falls back to `http://localhost:3000`.

### Run Lint

```bash
npm run lint
```

### Start A Production Server

```bash
npm run start
```

Use this after a successful build to run the Next.js production server locally. For everyday development, use `npm run dev`.

### Stop The Server

In the terminal running the server, press:

```text
Ctrl + C
```

Then confirm with `Y` if Windows asks.

### Static Preview Helper

`preview-server.js` is a legacy helper for previewing an existing static `out/` folder. It is not part of the Vercel MVP workflow and is not used by `npm run start`.

Typical use:

```bash
node preview-server.js
```

Then open:

```text
http://localhost:8088
```

The root-level static preview helpers are legacy-only. Use `npm run dev` for development and `npm run build` followed by `npm run start` for a local production check.

## Public Preview Link

`localhost` URLs only work on the laptop running the INCAR development server. Use a public preview link when the site needs to be opened on mobile or shared with friends, partners, or buyers for feedback.

Vercel preview links can be used before final launch. The recommended flow is to push the project to GitHub, import it into Vercel as a Next.js project, deploy, and copy the generated preview URL.

See [docs/public-preview-deployment.md](docs/public-preview-deployment.md) for the dashboard and CLI deployment steps.

### Common Troubleshooting

- If `npm` is blocked in PowerShell, use `npm.cmd install` or `npm.cmd run dev`.
- If port `3000` is already in use, stop the other server or run `npm run dev -- -p 3001` and open `http://localhost:3001`.
- If dependencies look broken, delete `node_modules` and run `npm install` again.
- If build output looks stale, stop the dev server and restart it with `npm run dev`.
- If the browser does not update, refresh the page or hard refresh with `Ctrl + F5`.
