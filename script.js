const fs = require('fs');
let content = fs.readFileSync('/tmp/anybe-next-integration/src/app/events/[slug]/page.tsx', 'utf8');

// Add motion import
content = content.replace("import { formatEventDate, formatEventRelative } from '@/lib/dateUtils';", "import { formatEventDate, formatEventRelative } from '@/lib/dateUtils';\nimport { motion } from 'framer-motion';");

// Calculate global values
const globalCalc = `
  const totalRemaining = event.ticket_tiers && event.ticket_tiers.length > 0
    ? event.ticket_tiers.reduce((sum, tier) => sum + (tier.quantity_available || 0), 0)
    : event.capacity || 0;
  const isSoldOut = totalRemaining === 0;

  const totalCapacity = event.capacity || Math.max(totalRemaining, 1);
  const fillPercentage = Math.max(0, Math.min(100, ((totalCapacity - totalRemaining) / totalCapacity) * 100));
`;
content = content.replace(/  const totalCapacity = [\s\S]*?const isSoldOut = totalCapacity === 0;/, globalCalc.trim());

// Add progress bar below "{tier.quantity_available} remaining"
const progressBar = `{tier.quantity_available !== null && (
                    <div className="relative z-10 mt-4">
                      <div className="text-xs text-silver-dim uppercase tracking-widest mb-2">
                        Only {tier.quantity_available} spots left
                      </div>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden border border-white/5 relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: \`\${fillPercentage}%\` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#8a7342] to-[#d4af37] rounded-full"
                        />
                      </div>
                    </div>
                  )}`;

content = content.replace(/\{tier\.quantity_available !== null && \([\s\S]*?\}\)/, progressBar);

fs.writeFileSync('/tmp/anybe-next-integration/src/app/events/[slug]/page.tsx', content);
