
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter, Calendar, Clock, MoreVertical } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ScheduledPost = {
  id: number;
  content: string;
  date: string;
  time: string;
  platforms: Array<{
    name: string;
    icon: React.ReactNode;
  }>;
  status: 'scheduled' | 'draft' | 'published';
};

const scheduledPosts: ScheduledPost[] = [
  {
    id: 1,
    content: "Exciting news! We're launching our new product next week. Stay tuned for more details!",
    date: "Apr 12, 2025",
    time: "10:00 AM",
    platforms: [
      { name: 'Facebook', icon: <Facebook className="h-3.5 w-3.5" /> },
      { name: 'Instagram', icon: <Instagram className="h-3.5 w-3.5" /> },
      { name: 'Twitter', icon: <Twitter className="h-3.5 w-3.5" /> }
    ],
    status: 'scheduled'
  },
  {
    id: 2,
    content: "Join our webinar on digital marketing strategies for small businesses this Thursday!",
    date: "Apr 15, 2025",
    time: "2:00 PM",
    platforms: [
      { name: 'Facebook', icon: <Facebook className="h-3.5 w-3.5" /> },
      { name: 'Twitter', icon: <Twitter className="h-3.5 w-3.5" /> }
    ],
    status: 'draft'
  },
  {
    id: 3,
    content: "Check out our latest blog post on 'Top 10 Social Media Trends for 2025'",
    date: "Apr 18, 2025",
    time: "3:30 PM",
    platforms: [
      { name: 'Facebook', icon: <Facebook className="h-3.5 w-3.5" /> },
      { name: 'Instagram', icon: <Instagram className="h-3.5 w-3.5" /> }
    ],
    status: 'scheduled'
  }
];

const PostScheduler: React.FC = () => {
  return (
    <Card className="col-span-12">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Upcoming Posts</CardTitle>
        <div className="flex items-center gap-2">
          <Progress value={67} className="w-32 h-2" />
          <span className="text-xs text-muted-foreground">8/12 posts this week</span>
          <Button size="sm">Schedule Post</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {scheduledPosts.map((post) => (
            <div key={post.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 mr-4">
                  <p className="font-medium text-sm line-clamp-2">{post.content}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center text-xs text-muted-foreground gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{post.time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {post.platforms.map((platform, idx) => (
                      <div 
                        key={idx} 
                        className="h-6 w-6 rounded-full bg-muted flex items-center justify-center border-2 border-background"
                      >
                        {platform.icon}
                      </div>
                    ))}
                  </div>
                  <Badge variant={post.status === 'draft' ? "outline" : "default"}>
                    {post.status}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PostScheduler;
