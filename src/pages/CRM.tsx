import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import { Users, Plus, Search, Filter, Phone, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const CRM = () => {
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

  const contacts = [
    {
      id: 1,
      name: "John Smith",
      company: "Acme Corp",
      phone: "+1-555-0101",
      email: "john@acme.com",
      status: "hot-lead",
      lastContact: "2024-01-15",
      value: "$5,000"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      company: "Tech Solutions",
      phone: "+1-555-0102",
      email: "sarah@techsol.com",
      status: "qualified",
      lastContact: "2024-01-14",
      value: "$12,500"
    },
    {
      id: 3,
      name: "Mike Davis",
      company: "Global Industries",
      phone: "+1-555-0103",
      email: "mike@global.com",
      status: "follow-up",
      lastContact: "2024-01-13",
      value: "$8,750"
    },
    {
      id: 4,
      name: "Emma Wilson",
      company: "StartupXYZ",
      phone: "+1-555-0104",
      email: "emma@startupxyz.com",
      status: "converted",
      lastContact: "2024-01-12",
      value: "$15,000"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'hot-lead':
        return <Badge className="bg-red-100 text-red-800">Hot Lead</Badge>;
      case 'qualified':
        return <Badge className="bg-yellow-100 text-yellow-800">Qualified</Badge>;
      case 'follow-up':
        return <Badge className="bg-blue-100 text-blue-800">Follow-up</Badge>;
      case 'converted':
        return <Badge className="bg-green-100 text-green-800">Converted</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CRM</h1>
          <p className="text-muted-foreground">
            Manage your customer relationships and sales pipeline
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search contacts..." className="pl-8" />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      <div className="grid gap-4">
        {contacts.map((contact) => (
          <Card key={contact.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-lg">{contact.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{contact.company}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(contact.status)}
                  <span className="text-lg font-semibold text-green-600">{contact.value}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Phone className="h-3 w-3" />
                    <span>{contact.phone}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Mail className="h-3 w-3" />
                    <span>{contact.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>Last contact: {contact.lastContact}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Phone className="mr-1 h-3 w-3" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="mr-1 h-3 w-3" />
                    Email
                  </Button>
                  <Button variant="outline" size="sm">
                    Edit
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

export default CRM;