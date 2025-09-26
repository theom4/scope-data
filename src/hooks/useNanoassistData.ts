import { useState, useEffect } from 'react';

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
      console.log('Fetching data from webhook...');

      const response = await fetch('https://n8n.voisero.info/webhook/airclaim-app-get');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const webhookData = await response.json();
      console.log('Webhook response:', webhookData);

      if (Array.isArray(webhookData) && webhookData.length > 0) {
        const firstRow = webhookData[0];
        const newData: NanoassistData = {
          total_apeluri: Number(firstRow.total_apeluri) || 0,
          apeluri_initiate: Number(firstRow.apeluri_initiate) || 0,
          apeluri_primite: Number(firstRow.apeluri_primite) || 0,
          rata_conversie: Number(firstRow.rata_conversie) || 0,
          minute_consumate: Number(firstRow.minute_consumate) || 0,
        };
        console.log('Setting new data:', newData);
        setData(newData);
        setError(null);
      } else {
        console.log('No data found in webhook response; keeping defaults');
        setError(null);
      }
    } catch (err) {
      console.error('Webhook fetch error:', err);
      setError('Failed to fetch data from webhook');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Poll every 30 seconds
    const pollInterval = setInterval(() => {
      fetchData();
    }, 30 * 1000);

    return () => {
      clearInterval(pollInterval);
    };
  }, []);

  return { data, loading, error, refetch: fetchData };
};
