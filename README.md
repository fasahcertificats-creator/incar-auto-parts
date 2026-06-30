# INCAR AUTO PARTS

INCAR AUTO PARTS is a premium B2B automotive supply, sourcing, export, and private label company based in China and focused on Saudi wholesale buyers.

## Brand Identity

- Brand name: INCAR AUTO PARTS
- Short brand name: INCAR
- Positioning: Global Automotive Supply & Private Label Solutions
- Extended positioning: Global Automotive Supply & Private Label Solutions from China to Saudi Arabia
- Core workflow: RFQ-only B2B sourcing

## Business Focus

INCAR helps Saudi wholesale buyers source reliable auto parts directly from China with factory sourcing, quality inspection, private label packaging, and export support.

The platform supports product discovery, RFQ lists, bulk Excel requirements, catalog lead capture, private label inquiries, and China-to-Saudi export coordination. It is built for wholesale sourcing conversations rather than consumer shopping flows.

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

### Build For Production

```bash
npm run build
```

This project uses `output: "export"` in `next.config.ts`, so production builds generate static output in `out/`.

### Run Lint

```bash
npm run lint
```

### Start A Production Server

```bash
npm run start
```

Use this only after a successful build when you want to test the exported production site from `out/`. For everyday development, use `npm run dev`.

### Stop The Server

In the terminal running the server, press:

```text
Ctrl + C
```

Then confirm with `Y` if Windows asks.

### Static Preview Helper

`preview-server.js` is the helper used by `npm run start` for previewing the static `out/` folder after a build. It is not the main development workflow.

Typical use:

```bash
npm run build
node preview-server.js
```

Then open:

```text
http://localhost:8088
```

The root-level `START_AUTO_PARTS_PREVIEW.bat` file is also a preview-only helper for the static export. Use `npm run dev` for normal development.

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
