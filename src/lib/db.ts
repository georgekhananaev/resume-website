import {type Db, MongoClient, type MongoClientOptions} from 'mongodb';

/**
 * Cached singleton MongoDB client for Next.js server components and API routes.
 *
 * In development, Next.js HMR recreates modules on every save, so we stash the
 * client on globalThis to avoid exhausting the Atlas connection pool.
 *
 * In production, each serverless instance creates its own client once and
 * reuses it across invocations.
 */

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'george_khananaev_portfolio';

if (!uri) {
    throw new Error('MONGODB_URI is not set. Add it to .env.');
}

const options: MongoClientOptions = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10_000,
    connectTimeoutMS: 10_000,
};

interface GlobalWithMongo {
    _mongoClientPromise?: Promise<MongoClient>;
}

const globalForMongo = globalThis as unknown as GlobalWithMongo;

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
    if (!globalForMongo._mongoClientPromise) {
        const client = new MongoClient(uri, options);
        globalForMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalForMongo._mongoClientPromise;
} else {
    const client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

export async function getDb(): Promise<Db> {
    const client = await clientPromise;
    return client.db(dbName);
}

export async function getClient(): Promise<MongoClient> {
    return clientPromise;
}

export const DB_NAME = dbName;
export const POSTS_COLLECTION = 'posts';
