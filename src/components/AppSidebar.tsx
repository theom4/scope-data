import { useState } from "react"
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Settings, 
  FileText,
  Calendar,
  HelpCircle
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

const mainItems = [
  { title: "Dashboard", url: "/", icon: BarChart3 },
  { title: "Analytics", url: "/analytics", icon: TrendingUp },
  { title: "Reports", url: "/reports", icon: FileText },
  { title: "Users", url: "/users", icon: Users },
  { title: "Events", url: "/events", icon: Calendar },
]

const settingsItems = [
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Help", url: "/help", icon: HelpCircle },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const collapsed = state === "collapsed"
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/"
    return currentPath.startsWith(path)
  }

  const getNavClass = (active: boolean) => 
    `group relative w-full justify-start px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
      active 
        ? "bg-primary text-primary-foreground shadow-primary rounded-lg" 
        : "text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg"
    }`

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent className="px-3 py-6">
        {/* Logo / Brand */}
        <div className="flex items-center gap-2 px-3 mb-8">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <BarChart3 className="h-4 w-4 text-white" />
          </div>
          {!collapsed && (
            <span className="font-bold text-lg">Analytics</span>
          )}
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              Main
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"}
                      className={getNavClass(isActive(item.url))}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="ml-2">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings Section */}
        <SidebarGroup className="mt-auto">
          {!collapsed && (
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              Support
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url}
                      className={getNavClass(isActive(item.url))}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="ml-2">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}