import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { drizzle as drizzlePostgres } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('DATABASE_URL is not configured');

const globalForDb = globalThis as unknown as {
  neonSql?: ReturnType<typeof neon>;
  postgresSql?: ReturnType<typeof postgres>;
};

// Neon HTTP is ideal in deployed serverless functions. During local development,
// use the standard Postgres transport so corporate/self-signed HTTPS proxies do
// not prevent Auth.js and Server Components from reaching the same Neon database.
const neonSql = globalForDb.neonSql ?? neon(databaseUrl);
const postgresSql = globalForDb.postgresSql ?? postgres(databaseUrl, { max: 5, ssl: 'require' });
if (process.env.NODE_ENV !== 'production') globalForDb.postgresSql = postgresSql;
else globalForDb.neonSql = neonSql;

const serverlessDb = drizzle(neonSql, { schema });
export const db = (process.env.NODE_ENV === 'production'
  ? serverlessDb
  : drizzlePostgres(postgresSql, { schema })) as typeof serverlessDb;
