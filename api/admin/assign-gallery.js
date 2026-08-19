import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        console.error('Missing Supabase environment variables');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    try {
        if (req.method === 'POST') {
            const { client_id, gallery_id } = req.body;

            if (!client_id || !gallery_id) {
                return res.status(400).json({ error: 'client_id and gallery_id are required' });
            }

            const { error } = await supabase
                .from('client_galleries')
                .insert({ client_id, gallery_id });

            if (error) {
                console.error('Gallery assignment error:', error);
                return res.status(400).json({ error: error.message });
            }

            return res.status(200).json({ success: true });
        }

        if (req.method === 'DELETE') {
            const { client_id, gallery_id } = req.query;

            if (!client_id || !gallery_id) {
                return res.status(400).json({ error: 'client_id and gallery_id are required' });
            }

            const { error } = await supabase
                .from('client_galleries')
                .delete()
                .eq('client_id', client_id)
                .eq('gallery_id', gallery_id);

            if (error) {
                console.error('Gallery unassignment error:', error);
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
