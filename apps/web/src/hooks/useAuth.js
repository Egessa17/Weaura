import { useState, useEffect } from 'react';
import { supabase } from '@/lib/superbaseClient';

//This will only be used by admins since clients have no accounts on Weaura

export const useAuth = () => {
  const [currentUser, setCurrentuser] = useState(null);

  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setInitialLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          await fetchUserProfile(session.user);
        } else {
          setCurrentuser(null);
          setInitialLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (authUser) => {
    try {
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      setCurrentuser({ ...authUser, ...profile, id: authUser.id });
    } catch {
      setCurrentuser(authUser);
    } finally {
      setInitialLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return { requiresMfa: false, user: data.user };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentuser(null);
  };

  const updateProfile = async (UserRoundIcon, data) => {
    const { data: updated, error } = await supabase
      .from('users')
      .update(data)
      .eq('id', userId)
      .select()
      .single()
    if (error) throw error;
    setCurrentuser((prev) => ({
      ...prev, ...updated
    }));
    return updated;
  };

  return {
    currentUser,
    initialLoading,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin',
  };
};

