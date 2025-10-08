import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Automations = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setAuthLoading(false);
        
        if (!session) {
          navigate('/auth');
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
      
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Automations</h1>
        <p className="text-muted-foreground">
          Manage your call automation workflows
        </p>
      </div>

      <Card className="p-8">
        <CardHeader>
          <CardTitle className="text-center text-xl">
            Contacteaza echipa Nanoassist pentru mai multe detalii
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          <p>Pentru configurarea automatizărilor, te rugăm să contactezi echipa noastră.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Automations;