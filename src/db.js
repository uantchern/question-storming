import { neon } from '@neondatabase/serverless';

// WARNING: In a production app, use environment variables and a backend proxy to protect credentials.
const databaseUrl = import.meta.env.VITE_DATABASE_URL || 'postgresql://neondb_owner:npg_0hp5ELqOfJzc@ep-lucky-silence-aij8amzl-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require';

export const sql = neon(databaseUrl);
