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
        const { DB_HOST, DB_NAME, DB_COLLECTION } = process.env;
        this.env = { DB_HOST, DB_NAME, DB_COLLECTION };
        this.client = new MongoClient(DB_HOST, options);
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
