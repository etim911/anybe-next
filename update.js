const fs = require('fs');

// 1. Update auth/page.tsx
let authPath = 'src/app/auth/page.tsx';
let authContent = fs.readFileSync(authPath, 'utf8');

authContent = authContent.replace(
  'const transition = {\n  type: \'spring\',\n  stiffness: 250,\n  damping: 28,\n  mass: 0.9\n};',
  'const transition = {\n  type: \'spring\',\n  stiffness: 400,\n  damping: 25\n};'
);

authContent = authContent.replace(
  '<motion.div layout className="py-6 px-2 overflow-hidden">',
  '<motion.div layout transition={transition} className="py-6 px-2 overflow-hidden">'
);

authContent = authContent.replace(
  'className="text-base text-brand-cream cursor-pointer"',
  'className="text-base text-brand-cream cursor-pointer leading-snug"'
);

authContent = authContent.replace(
  'text-brand-creamDark/60 leading-relaxed text-center',
  'text-brand-creamMuted leading-relaxed text-center'
);

fs.writeFileSync(authPath, authContent);

// 2. Update Header.tsx
let headerPath = 'src/components/layout/Header.tsx';
let headerContent = fs.readFileSync(headerPath, 'utf8');

headerContent = headerContent.replace(
  'export function Header() {\n  const pathname = usePathname();\n  const [guest, setGuest] = useState<Guest | null>(null);',
  'export function Header() {\n  const pathname = usePathname();\n  const [guest, setGuest] = useState<Guest | null>(null);\n  const [isMounted, setIsMounted] = useState(false);'
);

headerContent = headerContent.replace(
  '    setGuest(getStoredGuest());\n\n    const handleAuthChange = () => {\n      setGuest(getStoredGuest());\n    };\n    window.addEventListener(\'auth-change\', handleAuthChange);\n    return () => window.removeEventListener(\'auth-change\', handleAuthChange);\n  }, []);',
  '    setIsMounted(true);\n    setGuest(getStoredGuest());\n\n    const handleAuthChange = () => {\n      setGuest(getStoredGuest());\n    };\n    window.addEventListener(\'auth-change\', handleAuthChange);\n    return () => window.removeEventListener(\'auth-change\', handleAuthChange);\n  }, []);'
);

headerContent = headerContent.replace(
  '        {guest && (\n          <button\n            id="profile-trigger"',
  '        {isMounted ? (\n          guest && (\n          <button\n            id="profile-trigger"'
);

headerContent = headerContent.replace(
  '            {renderAvatar()}\n          </button>\n        )}',
  '            {renderAvatar()}\n          </button>\n          )\n        ) : (\n          <div className="w-10 h-10 rounded-full animate-pulse bg-white/10" />\n        )}'
);

fs.writeFileSync(headerPath, headerContent);

// 3. Update events/page.tsx
let eventsPath = 'src/app/events/page.tsx';
let eventsContent = fs.readFileSync(eventsPath, 'utf8');

eventsContent = eventsContent.replace(
  /  if \(loading\) \{\n    return \(\n      <div className="fixed inset-0 z-50 bg-bg-primary flex items-center justify-center">\n        <div className="text-\[28px\] text-silver-dim opacity-50 animate-pulse">✦<\/div>\n      <\/div>\n    \);\n  \}\n\n/,
  ''
);

eventsContent = eventsContent.replace(
  /      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">\n        \{events\.map\(\(event\) => \(\n          <EventCard\n            key=\{event\.id\}\n            slug=\{event\.slug\}\n            title=\{event\.title\}\n            date=\{event\.date\}\n            location=\{event\.location\}\n            status="upcoming"\n          \/>\n        \)\)\}\n        \{events\.length === 0 && \(\n          <div className="col-span-full text-center text-text-muted italic">No upcoming events\.<\/div>\n        \)\}\n      <\/div>/,
  `      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <EventCardSkeleton key={\`skeleton-\${i}\`} />
          ))
        ) : events.length > 0 ? (
          events.map((event) => (
            <EventCard
              key={event.id}
              slug={event.slug}
              title={event.title}
              date={event.date}
              location={event.location}
              status="upcoming"
            />
          ))
        ) : (
          <div className="col-span-full text-center text-text-muted italic">No upcoming events.</div>
        )}
      </div>`
);

fs.writeFileSync(eventsPath, eventsContent);

// 4. Update ProfileDrawer.tsx
let profilePath = 'src/components/profile/ProfileDrawer.tsx';
let profileContent = fs.readFileSync(profilePath, 'utf8');

profileContent = profileContent.replace(
  "transition={{ type: 'spring', damping: 25, stiffness: 200 }}",
  "transition={{ type: 'spring', damping: 25, stiffness: 400 }}"
);

fs.writeFileSync(profilePath, profileContent);

console.log('Update script executed.');
