import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

async function run() {
  const client = postgres(process.env.DATABASE_URL!, { max: 1, ssl: 'require' });
  const db = drizzle(client);
  await migrate(db, { migrationsFolder: 'drizzle' });
  await client.end();
  console.log('Database migrations applied.');
}
run().catch((error) => { console.error(error); process.exit(1); });
