import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
    try {
        await client.connect();
        const db = client.db('sagevcf');
        const collection = db.collection('participants');

        if (req.method === 'GET') {
            const { sessionId } = req.query;
            const participants = await collection.find({ sessionId }).toArray();
            return res.status(200).json(participants);
        }

        if (req.method === 'POST') {
            const participant = req.body;
            const result = await collection.insertOne(participant);
            return res.status(201).json(result);
        }

        if (req.method === 'DELETE') {
            const { id, sessionId } = req.body;
            const result = await collection.deleteOne({ _id: id, sessionId });
            return res.status(200).json(result);
        }

        res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
              }
