'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart2, 
  Calendar, 
  Home, 
  Lightbulb, 
  Link2, 
  MessageSquare, 
  Settings, 
  Users 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const SidebarLink = ({ href, icon, label, active }: SidebarLinkProps) => (
  <Link href={href} passHref>
    <Button
      variant={active ? 'secondary' : 'ghost'}
      className={cn(
        'w-full justify-start gap-2',
        active ? 'bg-muted font-medium' : 'font-normal'
      )}
    >
      {icon}
      <span>{label}</span>
    </Button>
  </Link>
);

export default function Sidebar() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    if (path === '/dashboard' && pathname === '/dashboard') {
      return true;
    }
    return pathname.startsWith(path) && path !== '/dashboard';
  };

  return (
    <aside className="hidden w-64 flex-col border-r bg-card px-4 py-6 md:flex">
      <div className="mb-6 flex items-center gap-2 px-2">
        <span className="text-xl font-semibold">Social Connect</span>
      </div>
      <nav className="space-y-1.5">
        <SidebarLink
          href="/dashboard"
          icon={<Home className="h-5 w-5" />}
          label="Dashboard"
          active={isActive('/dashboard')}
        />
        <SidebarLink
          href="/dashboard/analytics"
          icon={<BarChart2 className="h-5 w-5" />}
          label="Analytics"
          active={isActive('/dashboard/analytics')}
        />
        <SidebarLink
          href="/dashboard/calendar"
          icon={<Calendar className="h-5 w-5" />}
          label="Content Calendar"
          active={isActive('/dashboard/calendar')}
        />
        <SidebarLink
          href="/dashboard/content-suggestions"
          icon={<Lightbulb className="h-5 w-5" />}
          label="Content Suggestions"
          active={isActive('/dashboard/content-suggestions')}
        />
        <SidebarLink
          href="/dashboard/profiles"
          icon={<Link2 className="h-5 w-5" />}
          label="Social Profiles"
          active={isActive('/dashboard/profiles')}
        />
        <SidebarLink
          href="/dashboard/engagement"
          icon={<MessageSquare className="h-5 w-5" />}
          label="Engagement"
          active={isActive('/dashboard/engagement')}
        />
        <SidebarLink
          href="/dashboard/audience"
          icon={<Users className="h-5 w-5" />}
          label="Audience"
          active={isActive('/dashboard/audience')}
        />
      </nav>
      <div className="mt-auto space-y-1.5">
        <SidebarLink
          href="/dashboard/profile"
          icon={<Users className="h-5 w-5" />}
          label="Profile"
          active={isActive('/dashboard/profile')}
        />
        <SidebarLink
          href="/dashboard/settings"
          icon={<Settings className="h-5 w-5" />}
          label="Settings"
          active={isActive('/dashboard/settings')}
        />
      </div>
    </aside>
  );
}
