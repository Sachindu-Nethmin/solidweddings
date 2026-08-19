import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        console.error('Missing Supabase environment variables');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    try {
        const { email, password, full_name } = req.body;

        if (!email || !password || !full_name) {
            return res.status(400).json({ error: 'Email, password, and full_name are required' });
        }

        const { data: userData, error: userError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true
        });

        if (userError) {
            console.error('User creation error:', userError);
            return res.status(400).json({ error: userError.message });
        }

        const { error: profileError } = await supabase
            .from('clients')
            .insert({
                id: userData.user.id,
                email,
                full_name
            });

        if (profileError) {
            console.error('Profile creation error:', profileError);
            await supabase.auth.admin.deleteUser(userData.user.id);
            return res.status(400).json({ error: profileError.message });
        }

        res.status(200).json({
            user: {
                id: userData.user.id,
                email: userData.user.email
            }
        });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
}
