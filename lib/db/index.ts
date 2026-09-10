import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('DATABASE_URL is not configured');

const globalForDb = globalThis as unknown as { neonSql?: ReturnType<typeof neon> };
const sql = globalForDb.neonSql ?? neon(databaseUrl);
if (process.env.NODE_ENV !== 'production') globalForDb.neonSql = sql;

export const db = drizzle(sql, { schema });
