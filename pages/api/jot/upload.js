import jwt from 'jsonwebtoken';

// import fs from 'fs';
// import path from 'path';
import { Buffer } from 'buffer';
import crypto from 'crypto';

import { PrivateKey } from '../../.well-known/private';

import Mongo from '../../../api/mongo';
const mongo = new Mongo();

// import jsonwebtoken private key
// const jwtKeyPrivatePath = path.join(__dirname, '../'.repeat(5) + 'bin/jwt/');
const jwtKeyPrivate = Buffer.from(PrivateKey.base64, 'base64');
// const jwtKeyPrivate = fs.readFileSync(
//     path.join(jwtKeyPrivatePath, 'private.pem')
// );

const httpMessage = {
    s200: { status: 200, message: 'OK' },
    s201: { status: 201, message: 'Created' },

    e400: { status: 400, message: 'Malformed request' },
    e401: { status: 401, message: 'Invalid token' },
};

export default async function handler(req, res) {
    const { method, body } = req;
    const { jot, token } = body;

    if (method === 'POST' && jot && token) {
        const parsedToken = jwt.verify(
            token,
            jwtKeyPrivate,
            { algorithms: 'RS512' },
            (err, data) => (err ? false : data)
        );
        if (parsedToken === false)
            return res.status(401).json(httpMessage.e401);

        const jotHash = crypto.createHash('sha256').update(jot).digest('hex');
        const jotPayload = Buffer.from(jot, 'base64').toString('utf-8');

        const dbCollection = await mongo.collection('jotter');
        const dbResult = await dbCollection.find({ jotHash }).toArray();
        // return jot with same hash from db
        // if the jot exists
        if (dbResult.length > 0) {
            const { _id, id, jotHash, jotContent, date_created } = dbResult[0];
            res.status(200).json({
                jot: {
                    id: id,
                    hash: jotHash,
                    content: Buffer.from(jotContent, 'base64').toString(
                        'utf-8'
                    ),
                    date_created: date_created,
                },
            });
        } else {
            // add new jot in db
            const id = crypto.randomBytes(6).toString('hex');
            await dbCollection.insertMany([
                {
                    id: id,
                    jotHash: jotHash,
                    jotContent: jot,
                    date_created: Date.now(),
                },
            ]);

            res.status(201).json({
                jot: {
                    id: id,
                    text: jotPayload,
                    url: `/jot/${id}`,
                },
            });
        }
    } else res.status(400).json(httpMessage.e400);
}
