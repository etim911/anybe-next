const fs = require('fs');
const file = 'src/app/events/[slug]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "import { motion } from 'framer-motion';",
  "import { motion } from 'framer-motion';\nimport { StripeProvider } from '@/components/checkout/StripeProvider';\nimport { StripePaymentForm } from '@/components/checkout/StripePaymentForm';"
);

content = content.replace(
  "const [errorMsg, setErrorMsg] = useState('');",
  "const [errorMsg, setErrorMsg] = useState('');\n  const [clientSecret, setClientSecret] = useState<string | null>(null);\n  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);"
);

content = content.replace(
  "const handleRegister = async () => {",
  "const handleSecureSpot = async (tierId: string) => {\n    setSelectedTierId(tierId);\n    setIsRegistering(true);\n    setErrorMsg('');\n    const guest = getStoredGuest();\n    if (!guest) {\n      router.push(`/auth?redirect=/events/${event.slug}`);\n      return;\n    }\n\n    try {\n      const res = await fetch(`/api/checkout/reserve-ticket`, {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json' },\n        body: JSON.stringify({ userId: guest.id, eventId: event.id, ticketTierId: tierId })\n      });\n      const data = await res.json();\n      if (!res.ok) throw new Error(data.error || 'Failed to reserve ticket');\n      \n      // Mock obtaining a client secret for Stripe Payment Intent\n      // In a real app, the API would return this.\n      setClientSecret('pi_3MtwBwLkdIwHu7ix28a3tqPa_secret_B5Q9...mocked');\n    } catch (err) {\n      setErrorMsg((err as Error).message);\n      setSelectedTierId(null);\n    } finally {\n      setIsRegistering(false);\n    }\n  };\n\n  const handleRegister = async () => {"
);

content = content.replace(
  "</div>\n                  {tier.perks && tier.perks.length > 0 && (",
  "</div>\n                  <div className=\"relative z-10 mt-4 mb-2\">\n                    <Button \n                      onClick={() => handleSecureSpot(tier.id)} \n                      isLoading={isRegistering && selectedTierId === tier.id}\n                      disabled={isRegistering && selectedTierId !== tier.id}\n                      className=\"w-full tracking-[0.08em]\"\n                    >\n                      SECURE MY SPOT\n                    </Button>\n                  </div>\n                  {tier.perks && tier.perks.length > 0 && ("
);

content = content.replace(
  "{errorMsg && <div className=\"text-red-500 text-sm text-center mb-4\">{errorMsg}</div>}",
  "{errorMsg && <div className=\"text-red-500 text-sm text-center mb-4\">{errorMsg}</div>}\n\n        {clientSecret && (\n          <div className=\"fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/60\">\n            <div className=\"relative w-full max-w-lg\">\n              <StripeProvider clientSecret={clientSecret}>\n                <StripePaymentForm \n                  onSuccess={() => {\n                    alert('Payment successful!');\n                    setClientSecret(null);\n                  }}\n                  onCancel={() => setClientSecret(null)}\n                />\n              </StripeProvider>\n            </div>\n          </div>\n        )}"
);

fs.writeFileSync(file, content, 'utf8');
