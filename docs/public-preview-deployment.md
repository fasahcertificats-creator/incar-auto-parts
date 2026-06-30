# Public Preview Deployment

This guide prepares INCAR AUTO PARTS for a public preview link that can be opened on mobile and shared with friends, partners, or buyers for feedback.

## Deployment Readiness

- Project type: Next.js
- Recommended platform: Vercel
- Build command: `npm run build`
- Framework preset: Next.js
- Output setting: use Vercel's detected/default setting for this Next.js project
- Backend: none
- Database: none
- Authentication: none
- Payment or checkout: none

The current frontend preview does not require environment variables.

No environment variables required for current frontend preview.

## Option A: Deploy From Vercel Dashboard

1. Push the project to GitHub.
2. Open Vercel.
3. Import the GitHub repository.
4. Select the Next.js framework preset.
5. Keep the build command as `npm run build`.
6. Leave the output setting as Vercel's default/detected setting.
7. Deploy.
8. Copy the generated Vercel preview link.
9. Share the link on mobile or with friends and partners.

This is the recommended method for INCAR because every future GitHub push can create a new Vercel preview link.

## Option B: Deploy Using Vercel CLI

1. Install Vercel CLI if needed:

```bash
npm i -g vercel
```

2. Login to Vercel:

```bash
vercel login
```

3. From the project root, run the deployment command:

```bash
vercel
```

4. Follow the prompts and keep the detected Next.js settings.
5. Copy the generated deployment URL from the terminal.
6. Open the URL on mobile and share it for feedback.

Useful official references:

- Vercel Next.js deployment: https://vercel.com/docs/frameworks/full-stack/nextjs
- Vercel CLI deployment: https://vercel.com/docs/cli/deploying-from-cli

## Mobile Preview Checklist

Before sharing the preview link, test:

- [ ] Homepage on mobile
- [ ] Navigation mobile menu
- [ ] RFQ page
- [ ] Private Label page
- [ ] Catalogs page
- [ ] Contact page
- [ ] Buttons and forms
- [ ] Text readability
- [ ] Page loading
- [ ] No broken routes

## Notes

Localhost URLs such as `http://localhost:3000` only work on the laptop running the development server. A Vercel preview URL is public, works on mobile, and can be shared before final launch.
