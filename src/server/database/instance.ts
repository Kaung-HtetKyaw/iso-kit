import { MongoClient, Db } from 'mongodb';
import config from '../core/config';
import { getRegularClient } from './client';
import { Collections, getCollections } from './collections';

export type DatabaseContext = {
    regular: { client: MongoClient; db: Db };
    collections: Collections;
};

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */

if (!global.mongo) {
    // update the global store
    global.mongo = { context: null, promise: null };
}

let cached: DatabaseContext = null;

export const getDatabaseContext = async (): Promise<DatabaseContext> => {
    if (cached && global.mongo.context) {
        return cached;
    }

    if (!global.mongo.promise) {
        const init = async (): Promise<Pick<DatabaseContext, 'regular'>> => {
            // get regular client first
            const regularClient = await getRegularClient();
            const regularDb = regularClient.db(config.db.name);

            return {
                regular: { client: regularClient, db: regularDb },
            };
        };

        // get the promise
        global.mongo.promise = init();
    }

    // wait for it
    // and assigned it globally
    global.mongo.context = await global.mongo.promise;

    // update the cache
    cached = {
        ...global.mongo.context,
        collections: getCollections(global.mongo.context),
    };

    // finally return the cache
    return cached;
};
