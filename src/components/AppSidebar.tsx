import { Zap, Phone, Settings, Users, LayoutDashboard, MessageCircle, Megaphone, MessagesSquare } from "lucide-react"
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
  useSidebar,
} from "@/components/ui/sidebar"

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Automations", url: "/automations", icon: Zap },
  { title: "Call Recordings", url: "#", icon: Phone },
  { title: "CRM", url: "#", icon: Users },
  { title: "Campaigns", url: "/campaigns", icon: Megaphone },
  { title: "Whatsapp", url: "/whatsapp", icon: MessageCircle },
  { title: "AI Chat", url: "/chat", icon: MessagesSquare },
  { title: "Settings", url: "/settings", icon: Settings },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const collapsed = state === "collapsed"

  const isActive = (path: string) => currentPath === path
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary before:rounded-r bg-primary/5 text-primary font-medium" 
      : "hover:bg-muted/50"

  return (
    <Sidebar
      collapsible="icon"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    {item.url === "#" ? (
                      <div className="flex items-center cursor-not-allowed opacity-50">
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span className="ml-2">{item.title}</span>}
                      </div>
                    ) : (
                      <NavLink 
                        to={item.url} 
                        end
                        className={({ isActive }) => getNavCls({ isActive })}
                      >
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span className="ml-2">{item.title}</span>}
                      </NavLink>
                    )}
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