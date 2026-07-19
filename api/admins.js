import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
    try {
        await client.connect();
        const db = client.db('sagevcf');
        const collection = db.collection('admins');

        if (req.method === 'GET') {
            const admin = await collection.findOne({ username: 'admin' });
            if (!admin) {
                // Create default admin
                const defaultAdmin = {
                    username: 'admin',
                    password: process.env.ADMIN_PASSWORD || 'admin123',
                    createdAt: new Date().toISOString()
                };
                await collection.insertOne(defaultAdmin);
                return res.status(200).json({ exists: true, username: 'admin' });
            }
            return res.status(200).json({ exists: true, username: admin.username });
        }

        if (req.method === 'POST') {
            const { password } = req.body;
            const admin = await collection.findOne({ username: 'admin' });
            const isValid = admin && admin.password === password;
            return res.status(200).json({ valid: isValid });
        }

        res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
                  }
