// Auth Utilities
import { supabase } from './supabaseClient.js';

export async function getCurrentUser() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) return null;
  return session.user;
}

export async function getUserProfile(userId) {
  if (!userId) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.warn('Could not fetch profile:', error.message);
    return null;
  }
  return data;
}

export async function signOut() {
  await supabase.auth.signOut();
  window.location.href = 'index.html';
}

export function protectRoute(requiredRole = null) {
  return new Promise(async (resolve) => {
    const user = await getCurrentUser();
    if (!user) {
      window.location.href = `login.html?redirect=${encodeURIComponent(window.location.pathname)}`;
      return;
    }
    const profile = await getUserProfile(user.id);
    if (requiredRole && (!profile || (profile.role !== requiredRole && profile.role !== 'admin'))) {
      alert('Access restricted to ' + requiredRole);
      window.location.href = 'portal.html';
      return;
    }
    resolve({ user, profile });
  });
}
