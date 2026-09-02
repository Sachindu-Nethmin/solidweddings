import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '../_lib/adminAuth.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (!requireAdmin(req, res)) return;

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        return res.status(500).json({ error: 'Server configuration error' });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    try {
        if (req.method === 'POST') {
            const { client_email, client_id, gallery_id } = req.body;

            if (!gallery_id) {
                return res.status(400).json({ error: 'gallery_id is required' });
            }

            if (!client_email && !client_id) {
                return res.status(400).json({ error: 'client_email or client_id is required' });
            }

            const email = client_email || null;
            const clientId = client_id || null;

            const { error } = await supabase
                .from('client_galleries')
                .insert({ client_id: clientId, gallery_id, client_email: email });

            if (error) {
                return res.status(400).json({ error: error.message });
            }

            return res.status(200).json({ success: true });
        }

        if (req.method === 'DELETE') {
            const { client_email, client_id, gallery_id } = req.query;

            if (!gallery_id) {
                return res.status(400).json({ error: 'gallery_id is required' });
            }

            let query = supabase.from('client_galleries').delete().eq('gallery_id', gallery_id);

            if (client_email) {
                query = query.eq('client_email', client_email);
            } else if (client_id) {
                query = query.eq('client_id', client_id);
            } else {
                return res.status(400).json({ error: 'client_email or client_id is required' });
            }

            const { error } = await query;

            if (error) {
                return res.status(400).json({ error: error.message });
            }

            return res.status(200).json({ success: true });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Gallery assignment error:', error);
        res.status(500).json({ error: 'Failed to process request' });
    }
}
