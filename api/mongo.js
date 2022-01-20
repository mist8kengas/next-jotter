import { MongoClient } from 'mongodb';

// import environment variables
import dotenv from 'dotenv';
dotenv.config({ encoding: 'utf-8' });

export default class Mongo {
    /**
     *
     * @param {MongoClientOptions} options Client options
     */
    constructor(options = undefined) {
        const { DB_HOST, DB_NAME, DB_COLLECTION, DB_USER, DB_PASS } =
            process.env;
        this.env = { DB_HOST, DB_NAME, DB_COLLECTION };

        const mongoConnectionUrl = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}`;
        this.client = new MongoClient(mongoConnectionUrl, options);
    }

    /**
     *
     * @param {DbOptions} options Database options
     * @returns {Db} MongoDB Database
     */
    connect = async (options = undefined) => {
        const client = await this.client.connect();
        return client.db(this.env.DB_NAME, options);
    };

    /**
     *
     * @param {String} name Collection name
     * @returns Collection
     */
    collection = async (name) => {
        const db = await this.connect();
        const collection = db.collection(name);
        return collection;
    };
}
