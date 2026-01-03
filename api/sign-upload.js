import { v2 as cloudinary } from 'cloudinary';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
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

        // We can sign specific upload parameters here if we want to restrict uploads
        // For standard upload, we sign with timestamp.
        const signature = cloudinary.utils.api_sign_request({
            timestamp: timestamp
        }, apiSecret);

        res.status(200).json({
            signature,
            timestamp,
            cloudName,
            apiKey
        });

    } catch (error) {
        console.error("Sign Error:", error);
        res.status(500).json({ error: 'Failed to sign request' });
    }
}
