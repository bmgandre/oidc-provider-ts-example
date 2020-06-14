import { snakeCase } from 'lodash';
import { Db } from 'mongodb';

export class MongoCollectionSet {
    constructor(
        private readonly db: Db
    ) { }

    createIndexes(): Promise<any> {
        const createIndexesPromises = allCollections
            .map((collection: string) => snakeCase(collection))
            .map((collection: string) => {
                return this.createIndexesForCollection(collection);
            });
        return Promise.all(createIndexesPromises);
    }

    private createIndexesForCollection(name: string): Promise<any> {
        return this.db
            .collection(name)
            .createIndexes([
                ...(grantable.has(name) ? [{ key: { 'payload.grantId': 1 } }] : []),
                ...(name === 'device_code' ? [{ key: { 'payload.userCode': 1 }, unique: true }] : []),
                ...(name === 'session' ? [{ key: { 'payload.uid': 1 }, unique: true }] : []),
                { key: { expiresAt: 1 }, expireAfterSeconds: 0 },
            ]);
    }
}

const grantable = new Set([
    'access_token',
    'authorization_code',
    'refresh_token',
    'device_code',
]);

const allCollections: string[] = [
    "Session",
    "AccessToken",
    "AuthorizationCode",
    "RefreshToken",
    "ClientCredentials",
    "Client",
    "InitialAccessToken",
    "RegistrationAccessToken",
    "DeviceCode",
    "Interaction",
    "ReplayDetection",
    "PushedAuthorizationRequest"
];
