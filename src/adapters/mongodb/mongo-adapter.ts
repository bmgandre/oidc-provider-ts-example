import snakeCase from 'lodash/snakeCase';

import { MongoSetup } from './mongo-setup';
import { Collection } from 'mongodb';

export class MongoAdapter {
    constructor(
        private readonly name: string
    ) {
        this.name = snakeCase(name);
    }

    async upsert(id: string, payload: object, expiresIn: number): Promise<void> {
        let expiresAt: Date;

        if (expiresIn) {
            expiresAt = new Date(Date.now() + (expiresIn * 1000));
        }

        await this.coll().updateOne(
            { _id: id },
            { $set: { payload, ...(expiresAt ? { expiresAt } : undefined) } },
            { upsert: true },
        );
    }

    async find(id: string): Promise<any> {
        const result = await this.coll().find(
            { _id: id },
            { projection: { payload: 1 } },
        ).limit(1).next();

        if (!result) {
            return undefined;
        }
        return result.payload;
    }

    async findByUserCode(userCode: string): Promise<any> {
        const result = await this.coll().find(
            { 'payload.userCode': userCode },
            { projection: { payload: 1 } },
        ).limit(1).next();

        if (!result) {
            return undefined;
        }

        return result.payload;
    }

    async findByUid(uid: string): Promise<any> {
        const result = await this.coll().find(
            { 'payload.uid': uid },
            { projection: { payload: 1 } },
        ).limit(1).next();

        if (!result) {
            return undefined;
        }

        return result.payload;
    }

    async destroy(_id): Promise<void> {
        await this.coll().deleteOne({ _id });
    }

    async revokeByGrantId(grantId: string): Promise<void> {
        await this.coll().deleteMany({ 'payload.grantId': grantId });
    }

    async consume(id: string): Promise<void> {
        await this.coll().findOneAndUpdate(
            { _id: id },
            { $set: { 'payload.consumed': Math.floor(Date.now() / 1000) } },
        );
    }

    private coll(name?: string): Collection<any> {
        return MongoAdapter.coll(name || this.name);
    }

    private static coll(name: string) {
        return MongoSetup.db.collection(name);
    }
}
