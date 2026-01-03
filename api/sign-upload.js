import { v2 as cloudinary } from 'cloudinary';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Modern URL parsing to avoid DeprecationWarning
        const url = new URL(req.url, `http://${req.headers.host}`);
        const folder = url.searchParams.get('folder');

        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;

        if (!cloudName || !apiKey || !apiSecret) {
            return res.status(500).json({ error: 'Missing Cloudinary Environment Variables' });
        }

        // Configure Cloudinary
        cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret,
            secure: true
        });

        // Generate Signature
        const timestamp = Math.round((new Date()).getTime() / 1000);

        // Params to sign (must match what is sent to Cloudinary)
        const paramsToSign = {
            timestamp: timestamp
        };

        if (folder) {
            paramsToSign.folder = folder;
        }

        const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

        res.status(200).json({
            signature,
            timestamp,
            cloudName,
            apiKey,
            folder // Return it back to confirm
        });

    } catch (error) {
        console.error("Sign Error:", error);
        res.status(500).json({ error: 'Failed to sign request' });
    }
}
