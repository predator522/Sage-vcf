import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
    try {
        await client.connect();
        const db = client.db('sagevcf');
        const collection = db.collection('sessions');

        if (req.method === 'GET') {
            const sessions = await collection.find({}).toArray();
            return res.status(200).json(sessions);
        }

        if (req.method === 'POST') {
            const session = req.body;
            const result = await collection.insertOne(session);
            return res.status(201).json(result);
        }

        if (req.method === 'PUT') {
            const { id, update } = req.body;
            const result = await collection.updateOne(
                { id: id },
                { $set: update }
            );
            return res.status(200).json(result);
        }

        if (req.method === 'DELETE') {
            const { id } = req.body;
            const result = await collection.deleteOne({ id: id });
            return res.status(200).json(result);
        }

        res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
              }
