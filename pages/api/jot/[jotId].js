import Mongo from '../../../api/mongo';
const mongo = new Mongo();

const httpMessage = {
    s200: { status: 200, message: 'OK' },
    s201: { status: 201, message: 'Created' },

    e400: { status: 400, message: 'Malformed request' },
    e401: { status: 401, message: 'Invalid token' },
    e404: { status: 404, message: 'Not found' },
};

export default async function handler(req, res) {
    const { query } = req;

    // add new jot in db
    const dbCollection = await mongo.collection('jotter');
    const dbResponse = await dbCollection.find({ id: query.jotId }).toArray();

    if (dbResponse[0]) {
        const { _id, id, jotHash, jotContent, date_created } = dbResponse[0];
        res.status(200).json({
            jot: {
                hash: jotHash,
                content: atob(jotContent),
                date_created: date_created,
            },
        });
    } else res.status(404).json(httpMessage.e404);
}
