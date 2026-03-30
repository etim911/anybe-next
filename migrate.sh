#!/bin/bash
cd /tmp/anybe-next

claude --permission-mode bypassPermissions --print "You are migrating the static HTML pages to Next.js 14 App Router in the nextjs-migration branch. Do not touch the auth folder.
Follow these exact instructions:
1. src/app/page.tsx - Landing Page
- Migrate ALL content from index.html.
- Hero section: Logo SVG, 'Anybe Night' title in ornate book frame, tagline
- Video section (Google Drive embed in 9:16 portrait container - use a placeholder if not in html)
- About section: 'Dear Initiated' letter from Antalina (add a mock letter if not found in HTML, but keep exact copy if found. Since it's not in HTML, just write a fitting 'Dear Initiated' letter from Antalina).
- Next Event section: date, location, capacity, price
- Tickets CTA button
- Gallery section placeholder
- Keep ALL atmospheric elements: noise texture, fade-in animations (use Framer Motion), ornate flourishes

2. src/app/events/page.tsx - Events Dashboard
- Migrate from events.html
- User profile display (phone, name)
- My upcoming events / past events sections
- Fetch events from Supabase: select * from events order by created_at desc
- Show event cards
- Sign out button

3. src/app/terms/page.tsx - Terms Page
- Migrate ALL legal content from terms.html word for word. Strict TCPA-compliant copy. Do not change it.

4. src/app/events/[slug]/page.tsx - Dynamic Event Page
- Use apocalypse.html as the template/reference
- Fetch event data from Supabase by slug
- Show event title, description, date, location, capacity
- Registration CTA (links to auth if not logged in)
- Generate static metadata for SEO

5. Update src/app/layout.tsx
- Add Navigation component (placeholder for now)
- Add Footer component
- Proper Open Graph meta tags

Rules:
- TypeScript strict - no any
- Framer Motion for scroll animations
- Mobile-first
- Run npm run build after each page to fix errors

When done, write a report to ~/Documents/Reports/2026-03/nextjs-migration-phase2-pages.md."
