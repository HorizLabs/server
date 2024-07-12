import type {Config} from 'drizzle-kit';

export default {
    schema: './src/db/schema.ts',
    out: './src/db/migrations',
    dialect: 'postgresql',
    dbCredentials: {
        user: process.env.DB_USER!,
        host: process.env.DB_HOST!,
        database: process.env.DB_NAME!,
        password: process.env.DB_PASSWORD!,
        port: parseInt(process.env.DB_PORT!),
        ssl: process.env.DB_SSL?.toLowerCase() == 'true' ? true : false,
    }
} satisfies Config;