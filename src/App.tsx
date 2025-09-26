import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full bg-background">
            {/* Global Header with Sidebar Trigger */}
            <div className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center bg-background/80 backdrop-blur-sm border-b border-border/50">
              <SidebarTrigger className="ml-4" />
              <div className="flex-1 px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-semibold">Analytics Dashboard</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">A</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <AppSidebar />
            
            {/* Main Content */}
            <main className="flex-1 pt-14 min-h-screen">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/analytics" element={<Index />} />
                <Route path="/reports" element={<Index />} />
                <Route path="/users" element={<Index />} />
                <Route path="/events" element={<Index />} />
                <Route path="/performance" element={<Index />} />
                <Route path="/revenue" element={<Index />} />
                <Route path="/notifications" element={<Index />} />
                <Route path="/settings" element={<Index />} />
                <Route path="/help" element={<Index />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
