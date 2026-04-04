const fs = require('fs');
let eventsPath = 'src/app/events/page.tsx';
let eventsContent = fs.readFileSync(eventsPath, 'utf8');

eventsContent = eventsContent.replace(
  "import { EventCard } from '@/components/events/EventCard';",
  "import { EventCard, EventCardSkeleton } from '@/components/events/EventCard';"
);

fs.writeFileSync(eventsPath, eventsContent);
console.log('Import added.');
