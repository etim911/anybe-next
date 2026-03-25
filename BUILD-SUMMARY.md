# Anybe Night - Build Summary

## What was built
A stunning, dark, theatrical landing page for the "Anybe Night" immersive theater event.

## Design
- Exact style match from bookofyou.vercel.app
- Dark leather background (#0c0b0a, #141210) with noise texture overlay
- Fonts: Cormorant Garamond (body), Cinzel / Cinzel Decorative (headings)
- Gold (#b5a48a), silver (#c4bfb3), cream (#ece6d8) color palette
- Ornate corner SVG flourishes on book frames
- Ornamental dividers (- ✦ -)
- Scroll-triggered fade-in animations

## Sections
1. **Hero** - Logo SVG, "Anybe Night" title in ornate book frame with tagline
2. **Video** - Google Drive embed in 9:16 portrait container, centered
3. **About** - "Dear Initiated" letter from Antalina
4. **Next Event** - July 17, 2026 | LA | 100 guests | $77 early bird / $177 GA
5. **Tickets CTA** - "Secure Your Place" gold-bordered button (links to # for now)
6. **Gallery** - Placeholder "Photos coming soon"
7. **Footer** - Branding, night.anybe.com, 224 422 7777

## Technical
- Single static HTML file (no build step, no npm)
- Mobile-first responsive design
- vercel.json configured for static deployment
- Ready for GitHub push and Vercel deploy

## Files
- `/tmp/anybe-next/index.html` - The page
- `/tmp/anybe-next/vercel.json` - Vercel config
- `/tmp/anybe-next/BUILD-SUMMARY.md` - This file

## Next Steps
- Wire "Secure Your Place" button to Stripe checkout
- Add real photos to gallery section
- Update venue when confirmed
- Connect custom domain night.anybe.com
