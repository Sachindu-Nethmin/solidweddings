import crypto from 'crypto';

// Lightweight, dependency-free signed session token (HMAC-SHA256), scoped to
// the admin dashboard's serverless functions. Not a general-purpose JWT lib —
// just enough to prove "this request came from someone who passed /api/admin/login".

const DEFAULT_TTL_SECONDS = 8 * 60 * 60; // 8 hours

function base64urlJson(obj) {
    return Buffer.from(JSON.stringify(obj)).toString('base64url');
}

function hmac(data, secret) {
    return crypto.createHmac('sha256', secret).update(data).digest('base64url');
}

export function signAdminToken(secret, ttlSeconds = DEFAULT_TTL_SECONDS) {
    const now = Math.floor(Date.now() / 1000);
    const payload = { role: 'admin', iat: now, exp: now + ttlSeconds };
    const payloadPart = base64urlJson(payload);
    const signature = hmac(payloadPart, secret);
    return { token: `${payloadPart}.${signature}`, expiresAt: payload.exp * 1000 };
}

export function verifyAdminToken(token, secret) {
    if (!token || typeof token !== 'string') return false;

    const dot = token.lastIndexOf('.');
    if (dot === -1) return false;

    const payloadPart = token.slice(0, dot);
    const signature = token.slice(dot + 1);
    const expectedSignature = hmac(payloadPart, secret);

    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSignature);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
        return false;
    }

    let payload;
    try {
        payload = JSON.parse(Buffer.from(payloadPart, 'base64url').toString('utf8'));
    } catch {
        return false;
    }

    if (payload?.role !== 'admin') return false;
    if (typeof payload.exp !== 'number' || payload.exp < Math.floor(Date.now() / 1000)) return false;

    return true;
}

// Call at the top of any /api/admin/* (or other admin-only) handler.
// Returns true if the request carries a valid admin session; otherwise it
// writes the 401/500 response itself and returns false so the caller can `return`.
export function requireAdmin(req, res) {
    const secret = process.env.ADMIN_JWT_SECRET;
    if (!secret) {
        console.error('Missing ADMIN_JWT_SECRET environment variable');
        res.status(500).json({ error: 'Server configuration error' });
        return false;
    }

    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!verifyAdminToken(token, secret)) {
        res.status(401).json({ error: 'Unauthorized' });
        return false;
    }

    return true;
}

export function sha256Hex(str) {
    return crypto.createHash('sha256').update(str, 'utf8').digest('hex');
}

// Constant-time comparison for two equal-format hex hashes.
export function safeHexEqual(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string') return false;
    const aBuf = Buffer.from(a, 'hex');
    const bBuf = Buffer.from(b, 'hex');
    if (aBuf.length === 0 || aBuf.length !== bBuf.length) return false;
    return crypto.timingSafeEqual(aBuf, bBuf);
}
