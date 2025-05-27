import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Instagram, Twitter, Facebook, Linkedin } from 'lucide-react';

interface FollowerGrowthData {
  date: string;
  instagram?: number;
  twitter?: number;
  facebook?: number;
  linkedin?: number;
}

interface FollowerGrowthChartProps {
  data: FollowerGrowthData[];
  isLoading?: boolean;
  error?: string | null;
}

const FollowerGrowthChart: React.FC<FollowerGrowthChartProps> = ({ 
  data, 
  isLoading = false,
  error = null 
}) => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram', 'twitter', 'facebook', 'linkedin']);

  const togglePlatform = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      // Don't allow deselecting all platforms
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const filterDataByTimeRange = (data: FollowerGrowthData[]) => {
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (timeRange) {
      case '7d':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        cutoffDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        cutoffDate.setDate(now.getDate() - 30);
    }
    
    return data.filter(item => new Date(item.date) >= cutoffDate);
  };

  const filteredData = filterDataByTimeRange(data);

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return '#E1306C';
      case 'twitter':
        return '#1DA1F2';
      case 'facebook':
        return '#4267B2';
      case 'linkedin':
        return '#0077B5';
      default:
        return '#000000';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'facebook':
        return <Facebook className="h-4 w-4" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // Handle empty data gracefully
  const hasData = data && data.length > 0;

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Follower Growth</CardTitle>
            <CardDescription>Track your follower growth across platforms</CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange} disabled={isLoading || !hasData}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2">
          {['instagram', 'twitter', 'facebook', 'linkedin'].map(platform => (
            <button
              key={platform}
              onClick={() => togglePlatform(platform)}
              disabled={isLoading || !hasData}
              aria-pressed={selectedPlatforms.includes(platform)}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs ${
                selectedPlatforms.includes(platform)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              } ${(isLoading || !hasData) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {getPlatformIcon(platform)}
              <span>{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
            </button>
          ))}
        </div>
        
        {isLoading ? (
          <div className="h-[500px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="h-[500px] flex items-center justify-center">
            <div className="text-center text-red-500">
              <p>Failed to load follower data</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        ) : !hasData ? (
          <div className="h-[500px] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p>No follower data available</p>
              <p className="text-sm">Connect your social accounts to track follower growth</p>
            </div>
          </div>
        ) : (
          <div className="h-[500px] md:h-[550px] lg:h-[600px]">
            <ResponsiveContainer width="100%" height="100%" className="mt-4">
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => {
                    const d = new Date(date);
                    return `${d.getMonth() + 1}/${d.getDate()}`;
                  }}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    `${Number(value).toLocaleString()} followers`, 
                    typeof name === 'string' ? name.charAt(0).toUpperCase() + name.slice(1) : String(name)
                  ]}
                  labelFormatter={(label) => new Date(label).toLocaleDateString()}
                />
                <Legend />
                {selectedPlatforms.includes('instagram') && (
                  <Line 
                    type="monotone" 
                    dataKey="instagram" 
                    stroke={getPlatformColor('instagram')} 
                    activeDot={{ r: 8 }} 
                    name="Instagram"
                  />
                )}
                {selectedPlatforms.includes('twitter') && (
                  <Line 
                    type="monotone" 
                    dataKey="twitter" 
                    stroke={getPlatformColor('twitter')} 
                    activeDot={{ r: 8 }} 
                    name="Twitter"
                  />
                )}
                {selectedPlatforms.includes('facebook') && (
                  <Line 
                    type="monotone" 
                    dataKey="facebook" 
                    stroke={getPlatformColor('facebook')} 
                    activeDot={{ r: 8 }} 
                    name="Facebook"
                  />
                )}
                {selectedPlatforms.includes('linkedin') && (
                  <Line 
                    type="monotone" 
                    dataKey="linkedin" 
                    stroke={getPlatformColor('linkedin')} 
                    activeDot={{ r: 8 }} 
                    name="LinkedIn"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FollowerGrowthChart;
