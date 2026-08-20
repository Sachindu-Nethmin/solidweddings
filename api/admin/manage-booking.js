import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '../_lib/adminAuth.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (!requireAdmin(req, res)) return;

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    try {
        if (req.method === 'PATCH') {
            const { id, status } = req.body;
            if (!id || !status) {
                return res.status(400).json({ error: 'id and status are required' });
            }
            if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
                return res.status(400).json({ error: 'Invalid status' });
            }
            const { error } = await supabase
                .from('bookings')
                .update({ status })
                .eq('id', id);
            if (error) throw error;
            return res.status(200).json({ success: true });
        }

        if (req.method === 'DELETE') {
            const { id } = req.query;
            if (!id) {
                return res.status(400).json({ error: 'id is required' });
            }
            const { error } = await supabase
                .from('bookings')
                .delete()
                .eq('id', id);
            if (error) throw error;
            return res.status(200).json({ success: true });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Booking admin error:', error);
        return res.status(500).json({ error: error.message || 'Server error' });
    }
}
