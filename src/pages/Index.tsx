import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Activity,
  Eye,
  MousePointer,
  Calendar,
  BarChart3
} from "lucide-react"
import { MetricCard } from "@/components/MetricCard"
import { 
  RevenueChart, 
  VisitorChart, 
  DeviceChart, 
  UserActivityChart 
} from "@/components/DashboardChart"
import { useNanoassistData } from "@/hooks/useNanoassistData"
import { Button } from "@/components/ui/button"
import nanoassistLogo from '@/assets/nanoassist-logo-transparent.png';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setAuthLoading(false);
        
        if (!session) {
          navigate('/auth');
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
      
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

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

  const { data, loading, error } = useNanoassistData();

  if (loading) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-muted-foreground">Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-destructive">Error loading data: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img 
                src={nanoassistLogo} 
                alt="NanoAssist Logo" 
                className="h-10 w-auto object-contain mix-blend-multiply"
                style={{ background: 'transparent' }}
              />
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Statistici Apeluri Airclaim</h1>
                <p className="text-muted-foreground">
                  Welcome back, {user.email}
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Apeluri"
          value={data.total_apeluri.toLocaleString()}
          change={12.5}
          changeLabel="from last month"
          icon={Users}
          trend="up"
        />
        <MetricCard
          title="Apeluri Initiate"
          value={data.apeluri_initiate.toLocaleString()}
          change={8.2}
          changeLabel="from last month"
          icon={Eye}
          trend="up"
        />
        <MetricCard
          title="Apeluri Primite"
          value={data.apeluri_primite.toLocaleString()}
          change={-2.1}
          changeLabel="from last month"
          icon={DollarSign}
          trend="down"
        />
        <MetricCard
          title="Rata Conversie"
          value={`${data.rata_conversie}%`}
          change={0.8}
          changeLabel="from last month"
          icon={TrendingUp}
          trend="up"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <RevenueChart />
        <VisitorChart />
        <DeviceChart />
        <UserActivityChart />
        
        {/* Quick Stats Cards */}
        <div className="space-y-4">
          <MetricCard
            title="Bounce Rate"
            value="24.5%"
            change={-1.2}
            changeLabel="vs last week"
            icon={MousePointer}
            trend="up"
          />
          <MetricCard
            title="Session Duration"
            value="4:32"
            change={15.3}
            changeLabel="vs last week"
            icon={Activity}
            trend="up"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
          <h3 className="mb-4 font-semibold">Recent Events</h3>
          <div className="space-y-3">
            {[
              { event: "New user registration", time: "2 minutes ago", type: "success" },
              { event: "Payment processed", time: "5 minutes ago", type: "success" },
              { event: "Page view milestone reached", time: "1 hour ago", type: "info" },
              { event: "Server maintenance completed", time: "2 hours ago", type: "info" }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className={`h-2 w-2 rounded-full ${
                    item.type === 'success' ? 'bg-success' : 'bg-primary'
                  }`} />
                  <span className="text-sm">{item.event}</span>
                </div>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
          <h3 className="mb-4 font-semibold">Top Pages</h3>
          <div className="space-y-3">
            {[
              { page: "/dashboard", views: "2,341", percentage: 32 },
              { page: "/analytics", views: "1,892", percentage: 26 },
              { page: "/reports", views: "1,234", percentage: 17 },
              { page: "/settings", views: "987", percentage: 13 }
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.page}</span>
                  <span className="text-sm text-muted-foreground">{item.views} views</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted">
                  <div 
                    className="h-1.5 rounded-full bg-primary transition-all duration-500" 
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Index;