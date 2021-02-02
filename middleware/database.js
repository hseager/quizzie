import { MongoClient } from 'mongodb'

const { DB_CONNECTION, DB_NAME } = process.env

global.mongo = global.mongo || {};

export default async function database(req, res, next) {
    if (!global.mongo.client) {
        global.mongo.client = new MongoClient(DB_CONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        await global.mongo.client.connect();
    }
    req.db = global.mongo.client.db(DB_NAME);
    return next()
}