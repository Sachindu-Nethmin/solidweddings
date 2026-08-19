/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const ClientAuthContext = createContext(null);

export const useClientAuth = () => useContext(ClientAuthContext);

export const ClientAuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [clientProfile, setClientProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchClientProfile(session.user.id);
            } else {
                setLoading(false);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchClientProfile(session.user.id);
            } else {
                setClientProfile(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchClientProfile = async (userId) => {
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .eq('id', userId)
            .single();

        if (!error) {
            setClientProfile(data);
        }
        setLoading(false);
    };

    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setClientProfile(null);
    };

    const getAssignedGalleries = async () => {
        if (!user) return [];

        const { data, error } = await supabase
            .from('client_galleries')
            .select('gallery_id')
            .eq('client_id', user.id);

        if (error) throw error;
        return data.map(row => row.gallery_id);
    };

    return (
        <ClientAuthContext.Provider value={{ user, clientProfile, loading, signIn, signOut, getAssignedGalleries }}>
            {children}
        </ClientAuthContext.Provider>
    );
};
