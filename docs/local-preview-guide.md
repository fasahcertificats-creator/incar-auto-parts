# INCAR Local Preview Guide

This guide explains how to preview the INCAR website locally on Windows using VS Code and a browser.

## 1. Open The Project Folder In VS Code

Open this folder:

```text
D:\in car\auto-parts-sourcing
```

In VS Code, choose `File > Open Folder`, then select `auto-parts-sourcing`.

## 2. Open The Terminal

In VS Code, open:

```text
Terminal > New Terminal
```

The terminal should show that it is inside:

```text
D:\in car\auto-parts-sourcing
```

## 3. Install Dependencies

Run:

```bash
npm install
```

If PowerShell blocks `npm`, run:

```bash
npm.cmd install
```

## 4. Start The Development Server

Run:

```bash
npm run dev
```

If PowerShell blocks `npm`, run:

```bash
npm.cmd run dev
```

## 5. Open The Local Website

Open this URL in the browser:

```text
http://localhost:3000
```

Main routes to check:

- `http://localhost:3000/`
- `http://localhost:3000/catalogs`
- `http://localhost:3000/private-label`
- `http://localhost:3000/quality-control`
- `http://localhost:3000/rfq`
- `http://localhost:3000/contact`

## 6. Test Mobile Responsive Mode

In Chrome or Edge:

1. Open the website.
2. Press `F12`.
3. Click the device toolbar icon.
4. Test common widths such as `390 x 844` and `768 x 1024`.
5. Check that navigation, forms, CTAs, and page sections remain usable.

## 7. Stop The Server

Return to the terminal running the server and press:

```text
Ctrl + C
```

If Windows asks for confirmation, type:

```text
Y
```

Then press `Enter`.

## Optional Static Preview

The Next.js development server is the main workflow. Use it for normal editing and previewing.

The project also includes `preview-server.js` for previewing the static `out/` folder after a production build:

```bash
npm run build
node preview-server.js
```

Then open:

```text
http://localhost:8088
```

Root-level preview batch files such as `START_AUTO_PARTS_PREVIEW.bat` are static preview helpers only. They do not replace `npm run dev`.

## Troubleshooting

- Node.js must be `20.9.0` or newer.
- If port `3000` is busy, stop the other local server or run `npm run dev -- -p 3001`.
- If the page does not load, check that the terminal says the server is ready.
- If `npm` is blocked by PowerShell policy, use `npm.cmd`.
- If dependencies fail, run `npm install` again from the project folder.
