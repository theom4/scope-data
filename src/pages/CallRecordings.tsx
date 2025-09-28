import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import { Phone, Play, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const CallRecordings = () => {
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

  const recordings = [
    {
      id: 1,
      caller: "John Smith",
      phone: "+1-555-0101",
      duration: "03:42",
      date: "2024-01-15",
      time: "14:30",
      status: "completed",
      outcome: "converted"
    },
    {
      id: 2,
      caller: "Sarah Johnson",
      phone: "+1-555-0102",
      duration: "01:18",
      date: "2024-01-15",
      time: "13:45",
      status: "completed",
      outcome: "follow-up"
    },
    {
      id: 3,
      caller: "Mike Davis",
      phone: "+1-555-0103",
      duration: "05:27",
      date: "2024-01-15",
      time: "12:15",
      status: "completed",
      outcome: "not-interested"
    },
    {
      id: 4,
      caller: "Emma Wilson",
      phone: "+1-555-0104",
      duration: "02:33",
      date: "2024-01-14",
      time: "16:20",
      status: "completed",
      outcome: "converted"
    }
  ];

  const getOutcomeBadge = (outcome: string) => {
    switch (outcome) {
      case 'converted':
        return <Badge className="bg-green-100 text-green-800">Converted</Badge>;
      case 'follow-up':
        return <Badge className="bg-blue-100 text-blue-800">Follow-up</Badge>;
      case 'not-interested':
        return <Badge className="bg-red-100 text-red-800">Not Interested</Badge>;
      default:
        return <Badge variant="outline">{outcome}</Badge>;
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Call Recordings</h1>
          <p className="text-muted-foreground">
            Review and manage your call recordings
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search recordings..." className="pl-8 w-64" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {recordings.map((recording) => (
          <Card key={recording.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-lg">{recording.caller}</CardTitle>
                    <p className="text-sm text-muted-foreground">{recording.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getOutcomeBadge(recording.outcome)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <span>Duration: {recording.duration}</span>
                  <span>{recording.date} at {recording.time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Play className="mr-1 h-3 w-3" />
                    Play
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-1 h-3 w-3" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CallRecordings;