import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface NanoassistData {
  total_apeluri: number;
  apeluri_initiate: number;
  apeluri_primite: number;
  rata_conversie: number;
  minute_consumate: number;
}

export const useNanoassistData = () => {
  const [data, setData] = useState<NanoassistData>({
    total_apeluri: 0,
    apeluri_initiate: 0,
    apeluri_primite: 0,
    rata_conversie: 0,
    minute_consumate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      // Using any type to bypass TypeScript strict typing issues
      const { data: result, error } = await (supabase as any)
        .from('nanoassist')
        .select('total_apeluri, apeluri_initiate, apeluri_primite, rata_conversie, minute_consumate')
        .eq('client', 'Airclaim')
        .maybeSingle();

      if (error) {
        console.error('Error fetching nanoassist data:', error);
        setError(error.message);
        return;
      }

      if (result) {
        setData({
          total_apeluri: Number(result.total_apeluri) || 0,
          apeluri_initiate: Number(result.apeluri_initiate) || 0,
          apeluri_primite: Number(result.apeluri_primite) || 0,
          rata_conversie: Number(result.rata_conversie) || 0,
          minute_consumate: Number(result.minute_consumate) || 0,
        });
        setError(null);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up real-time subscription
    const channel = supabase
      .channel('nanoassist-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'nanoassist',
          filter: 'client=eq.Airclaim'
        },
        () => {
          console.log('Nanoassist data updated, refetching...');
          fetchData();
        }
      )
      .subscribe();

    // Backup polling every 5 minutes
    const pollInterval = setInterval(() => {
      fetchData();
    }, 5 * 60 * 1000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(pollInterval);
    };
  }, []);

  return { data, loading, error, refetch: fetchData };
};