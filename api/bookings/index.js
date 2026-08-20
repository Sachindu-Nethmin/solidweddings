import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    try {
        if (req.method === 'GET') {
            const { data, error } = await supabase
                .from('bookings')
                .select('*')
                .order('wedding_date', { ascending: true });

            if (error) throw error;
            return res.status(200).json(data);
        }

        if (req.method === 'POST') {
            const { client_name, client_email, client_phone, package_name, wedding_date, venue, message } = req.body;

            if (!client_name || !client_email || !client_phone || !package_name || !wedding_date) {
                return res.status(400).json({ error: 'Name, email, phone, package, and date are required' });
            }

            const { data, error } = await supabase
                .from('bookings')
                .insert({ client_name, client_email, client_phone, package_name, wedding_date, venue, message })
                .select()
                .single();

            if (error) throw error;
            return res.status(200).json({ success: true, booking: data });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Bookings error:', error);
        return res.status(500).json({ error: error.message || 'Server error' });
    }
}
