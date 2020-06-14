import { MongoClient, Db } from 'mongodb';

import { MongoCollectionSet } from './mongo-collection-set';

export class MongoSetup {
    static dbName: string = "oidc-provider";
    static client: MongoClient;
    static db: Db;

    static async setup(): Promise<any> {
        MongoSetup.client = await MongoClient.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
        });

        MongoSetup.db = MongoSetup.client.db(this.dbName);

        const collectionSet = new MongoCollectionSet(MongoSetup.db);
        await collectionSet.createIndexes();
    }
}
