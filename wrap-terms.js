import fs from 'fs';

const html = fs.readFileSync('/tmp/anybe-next/terms.html', 'utf8');
const bodyMatch = html.match(/<body>([\s\S]*?)<\/body>/i);

if (bodyMatch) {
  let innerHtml = bodyMatch[1];
  
  // Replace class= with className=
  innerHtml = innerHtml.replace(/class=/g, 'className=');
  // Handle any inline styles or other self closing tags if necessary, but this is simple HTML mostly.
  // We can just dump it as dangerouslySetInnerHTML to avoid React parser errors with raw HTML.
  
  const reactCode = `import React from 'react';

export default function TermsPage() {
  return (
    <main className="relative z-10 max-w-[800px] mx-auto px-6 pt-24 pb-16 min-h-screen bg-bg-primary text-text-primary">
      <div dangerouslySetInnerHTML={{ __html: \`${innerHtml.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\` }} />
    </main>
  );
}
`;

  fs.writeFileSync('/tmp/anybe-next/src/app/terms/page.tsx', reactCode);
  console.log('Terms page created.');
}
