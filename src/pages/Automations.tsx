import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import { Bot, Plus, Play, Pause, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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

  const automations = [
    {
      id: 1,
      name: "Welcome Call Automation",
      description: "Automatically calls new leads within 5 minutes",
      status: "active",
      triggers: 12,
      lastRun: "2 hours ago"
    },
    {
      id: 2,
      name: "Follow-up Reminder",
      description: "Sends follow-up calls to missed opportunities",
      status: "paused",
      triggers: 8,
      lastRun: "1 day ago"
    },
    {
      id: 3,
      name: "Appointment Confirmation",
      description: "Confirms appointments 24 hours before scheduled time",
      status: "active",
      triggers: 15,
      lastRun: "30 minutes ago"
    }
  ];

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Automations</h1>
          <p className="text-muted-foreground">
            Manage your call automation workflows
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Automation
        </Button>
      </div>

      <div className="grid gap-6">
        {automations.map((automation) => (
          <Card key={automation.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-3">
                <Bot className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-lg">{automation.name}</CardTitle>
                  <CardDescription>{automation.description}</CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={automation.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}
                >
                  {automation.status === 'active' ? (
                    <>
                      <Pause className="mr-1 h-3 w-3" />
                      Active
                    </>
                  ) : (
                    <>
                      <Play className="mr-1 h-3 w-3" />
                      Paused
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Triggered {automation.triggers} times today</span>
                <span>Last run: {automation.lastRun}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Automations;