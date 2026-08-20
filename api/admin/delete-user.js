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

    if (req.method !== 'DELETE') {
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
        const { clientId } = req.query;

        if (!clientId) {
            return res.status(400).json({ error: 'Client ID is required' });
        }

        // Look up the client's email first so we can also clean up any
        // gallery assignments made by email before this account existed
        // (client_galleries.client_id is null on those rows).
        const { data: clientRow } = await supabase
            .from('clients')
            .select('email')
            .eq('id', clientId)
            .single();

        await supabase
            .from('client_galleries')
            .delete()
            .eq('client_id', clientId);

        if (clientRow?.email) {
            await supabase
                .from('client_galleries')
                .delete()
                .eq('client_email', clientRow.email);
        }

        const { error: profileError } = await supabase
            .from('clients')
            .delete()
            .eq('id', clientId);

        if (profileError) {
            console.error('Profile deletion error:', profileError);
            return res.status(400).json({ error: profileError.message });
        }

        const { error: userError } = await supabase.auth.admin.deleteUser(clientId);

        if (userError) {
            console.error('User deletion error:', userError);
            return res.status(400).json({ error: userError.message });
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
}
