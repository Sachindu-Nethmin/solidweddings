import { sha256Hex, safeHexEqual, signAdminToken } from '../_lib/adminAuth.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const userHash = process.env.ADMIN_USER_HASH;
    const passHash = process.env.ADMIN_PASS_HASH;
    const secret = process.env.ADMIN_JWT_SECRET;

    if (!userHash || !passHash || !secret) {
        console.error('Missing admin auth environment variables (ADMIN_USER_HASH / ADMIN_PASS_HASH / ADMIN_JWT_SECRET)');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    const { username, password } = req.body || {};

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const inputUserHash = sha256Hex(username);
    const inputPassHash = sha256Hex(password);

    if (!safeHexEqual(inputUserHash, userHash) || !safeHexEqual(inputPassHash, passHash)) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }

    const { token, expiresAt } = signAdminToken(secret);
    res.status(200).json({ token, expiresAt });
}
