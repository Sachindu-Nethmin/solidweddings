import { v2 as cloudinary } from 'cloudinary';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { public_id } = req.body;

        if (!public_id) {
            return res.status(400).json({ error: 'Missing public_id' });
        }

        // Config
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;

        if (!cloudName || !apiKey || !apiSecret) {
            console.error("Missing Cloudinary Keys for Deletion");
            return res.status(500).json({ error: 'Missing Cloudinary Environment Variables' });
        }

        cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret,
            secure: true
        });

        // Delete
        console.log(`[Delete] Attempting to delete public_id: ${public_id}`);
        const result = await cloudinary.uploader.destroy(public_id);
        console.log(`[Delete] Result:`, result);

        /* 
           Cloudinary Destroy Result Format:
           { result: 'ok' } or { result: 'not found' }
        */

        if (result.result !== 'ok' && result.result !== 'not found') {
            return res.status(500).json({ error: `Cloudinary Error: ${result.result}` });
        }

        res.status(200).json({ success: true, data: result });

    } catch (error) {
        console.error("Delete Handler Error:", error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
