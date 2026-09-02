import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '../_lib/adminAuth.js';

// Lists client portal accounts for the admin dashboard.
//
// This has to run server-side with the service-role key: `public.clients` is
// under RLS and the only SELECT policy is scoped to `authenticated` rows where
// id = auth.uid(). The admin dashboard authenticates with its own signed token
// (see _lib/adminAuth.js), NOT a Supabase session, so a browser-side query
// there hits the database as `anon` and silently comes back with zero rows.

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!requireAdmin(req, res)) return;

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        console.error('Missing Supabase environment variables');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    try {
        const { data, error } = await supabase
            .from('clients')
            .select('id, email, full_name, created_at')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Client list error:', error);
            return res.status(400).json({ error: error.message });
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error('Client list error:', error);
        return res.status(500).json({ error: 'Failed to load clients' });
    }
}
