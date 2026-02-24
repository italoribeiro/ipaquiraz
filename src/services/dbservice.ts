import { supabase } from '@/lib/supabase';

/**
 * Model (MVC) - Persistência no Supabase
 * Grava nas tabelas site_visitors, site_prayer e site_contact.
 */

export const saveVisitorData = async (data: any) => {
  const { error } = await supabase.from('site_visitors').insert([data]);
  if (error) throw error;
};

export const savePrayerRequest = async (data: any) => {
  const { error } = await supabase.from('site_prayer').insert([data]);
  if (error) throw error;
};

export const saveContactMessage = async (data: any) => {
  const { error } = await supabase.from('site_contact').insert([data]);
  if (error) throw error;
};