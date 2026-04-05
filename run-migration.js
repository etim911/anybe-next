const { Client } = require('pg');
const fs = require('fs');

const client = new Client({
  connectionString: 'postgresql://postgres.ekdxtohgrlzugluzmqpb:dydNe2-bojwej-nicnih@aws-0-us-west-1.pooler.supabase.com:6543/postgres'
});

async function run() {
  await client.connect();
  const sql = fs.readFileSync('/tmp/anybe-next-integration/docs/waitlist-migration.sql', 'utf8');
  await client.query(sql);
  console.log("Migration executed!");
  await client.end();
}
run().catch(console.error);
