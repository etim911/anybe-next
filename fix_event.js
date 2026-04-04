const fs = require('fs');
const path = require('path');

const pagePath = '/tmp/anybe-next-integration/src/app/events/[slug]/page.tsx';
let page = fs.readFileSync(pagePath, 'utf8');

// Update button tracking
page = page.replace(/className="tracking-\[0\.12em\]">/g, 'className="tracking-[0.08em]">');
page = page.replace(/>\s*Secure My Spot\s*<\/Button>/, '>SECURE MY SPOT</Button>');
page = page.replace(/>\s*Sign In to Secure Spot\s*<\/Button>/, '>SIGN IN TO SECURE SPOT</Button>');

// Replace bg-bg-deep with glassmorphism to avoid opaque breaks
page = page.replace(/bg-bg-deep/g, 'backdrop-blur-sm bg-black/40 rounded-full border border-white/5');

fs.writeFileSync(pagePath, page);

console.log('Event page script completed');
