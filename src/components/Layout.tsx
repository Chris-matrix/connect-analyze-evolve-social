
import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Calendar,
  Home,
  Instagram,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Users,
} from 'lucide-react';
import Navbar from '@/components/Navbar';

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Define menu items with their paths
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: BarChart3, label: 'Analytics', path: '/dashboard/analytics' },
    { icon: Calendar, label: 'Content Calendar', path: '/dashboard/calendar' },
    { icon: Instagram, label: 'Social Profiles', path: '/dashboard/profiles' },
    { icon: MessageSquare, label: 'Engagement', path: '/dashboard/engagement' },
    { icon: Users, label: 'Audience', path: '/dashboard/audience' },
  ];

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen bg-muted/40">
        <Sidebar className="border-r">
          <SidebarHeader className="flex items-center justify-between px-4">
            <div className="flex items-center gap-2 font-semibold">
              <span className="bg-gradient-to-r from-social-blue to-social-purple bg-clip-text text-transparent">
                SocialPulse
              </span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    asChild 
                    className={location.pathname === item.path ? "nav-item active" : "nav-item"}
                  >
                    <Link to={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  className={location.pathname === "/dashboard/settings" ? "nav-item active" : "nav-item"}
                >
                  <Link to="/dashboard/settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
        
        <SidebarTrigger className="fixed right-4 bottom-4 md:hidden">
          <Button size="icon" variant="outline" className="rounded-full h-10 w-10">
            <Home className="h-5 w-5" />
          </Button>
        </SidebarTrigger>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
