import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
    try {
        await client.connect();
        const db = client.db('sagevcf');
        const collection = db.collection('groups');

        if (req.method === 'GET') {
            const groups = await collection.find({}).toArray();
            return res.status(200).json(groups);
        }

        if (req.method === 'POST') {
            const group = req.body;
            const result = await collection.insertOne(group);
            return res.status(201).json(result);
        }

        res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
} 
