
import React, { useState, useEffect } from 'react';
import { BarChart3, Loader2, Filter, Instagram, Twitter, Facebook, Linkedin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import * as mockApi from '@/lib/mock-data/mock-api';
import { AnalyticsData } from '@/types/dashboard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [filteredData, setFilteredData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Filtering states
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined });
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [selectedMetric, setSelectedMetric] = useState<string>("all");

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        console.log('Fetching analytics data...');
        const data = await mockApi.getAnalyticsData();
        console.log('Analytics data received:', data);
        
        if (!data) {
          throw new Error('No data returned from API');
        }
        
        // Ensure all required fields are present
        const safeData = {
          platformPerformance: data.platformPerformance || [],
          engagementData: data.engagementData || [],
          audienceGrowth: data.audienceGrowth || [],
        };
        
        console.log('Setting analytics data:', safeData);
        setAnalyticsData(safeData);
        setFilteredData(safeData);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setError('Failed to load analytics data. ' + (error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);
  
  // Apply filters when filter values change
  useEffect(() => {
    if (!analyticsData) {
      console.warn('No analytics data available to filter');
      return;
    }
    
    try {
      console.log('Applying filters with data:', analyticsData);
      const filtered = { 
        platformPerformance: [...(analyticsData.platformPerformance || [])],
        engagementData: [...(analyticsData.engagementData || [])],
        audienceGrowth: [...(analyticsData.audienceGrowth || [])]
      };
      
      // Filter by platform
      if (selectedPlatform !== "all") {
        console.log(`Filtering by platform: ${selectedPlatform}`);
        
        // Filter platform performance data
        if (filtered.platformPerformance) {
          filtered.platformPerformance = filtered.platformPerformance.filter(item => 
            item && item.platform && item.platform.toLowerCase() === selectedPlatform.toLowerCase()
          );
        }
        
        // Filter engagement data by platform
        if (filtered.engagementData) {
          filtered.engagementData = filtered.engagementData.filter(item => {
            if (!item) return false;
            // Only keep data points that have engagement for the selected platform
            return item[selectedPlatform as keyof typeof item] !== undefined;
          });
        }
        
        // Filter audience growth data - maintain the structure but zero out non-selected platforms
        if (filtered.audienceGrowth) {
          filtered.audienceGrowth = filtered.audienceGrowth.map(item => {
            if (!item) return { month: '', instagram: 0, twitter: 0, facebook: 0, linkedin: 0 };
            
            // Create a new object with all platforms set to 0 except the selected one
            return {
              month: item.month || '',
              instagram: selectedPlatform === 'instagram' ? (item.instagram || 0) : 0,
              twitter: selectedPlatform === 'twitter' ? (item.twitter || 0) : 0,
              facebook: selectedPlatform === 'facebook' ? (item.facebook || 0) : 0,
              linkedin: selectedPlatform === 'linkedin' ? (item.linkedin || 0) : 0
            };
          });
        }
      }
      
      // Filter by date range
      if (dateRange.from && dateRange.to) {
        console.log(`Filtering by date range: ${dateRange.from} to ${dateRange.to}`);
        const fromDate = dateRange.from;
        const toDate = dateRange.to;
        
        // Filter engagement data by date
        if (filtered.engagementData) {
          filtered.engagementData = filtered.engagementData.filter(item => {
            if (!item || !item.date) return false;
            try {
              const itemDate = new Date(item.date);
              return itemDate >= fromDate && itemDate <= toDate;
            } catch (e) {
              console.warn('Invalid date in engagement data:', item.date);
              return false;
            }
          });
        }
        
        // Filter audience growth data by month
        if (filtered.audienceGrowth) {
          filtered.audienceGrowth = filtered.audienceGrowth.filter(item => {
            if (!item || !item.month) return false;
            
            try {
              // Parse month string like "Jan 2023"
              const [monthStr, yearStr] = item.month.split(' ');
              const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(monthStr);
              if (monthIndex === -1) {
                console.warn(`Could not parse month: ${item.month}`);
                return true; // Keep if we can't parse
              }
              
              const itemDate = new Date(parseInt(yearStr), monthIndex);
              return itemDate >= new Date(fromDate.getFullYear(), fromDate.getMonth()) && 
                    itemDate <= new Date(toDate.getFullYear(), toDate.getMonth());
            } catch (e) {
              console.warn('Error parsing date in audience growth data:', item.month, e);
              return false;
            }
          });
        }
      }
      
      console.log('Filtered data:', filtered);
      setFilteredData(filtered);
    } catch (error) {
      console.error('Error applying filters:', error);
      // Fall back to unfiltered data
      setFilteredData(analyticsData);
    }
  }, [analyticsData, selectedPlatform, dateRange]);
  
  // Reset filters
  const resetFilters = () => {
    setSelectedPlatform("all");
    setDateRange({ from: undefined, to: undefined });
    setSelectedMetric("all");
    if (analyticsData) {
      setFilteredData(analyticsData);
    }
  };

  // Get platform icon
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading analytics data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>{error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  // Get data from filteredData if available, otherwise use analyticsData
  const { platformPerformance = [], engagementData = [], audienceGrowth = [] } = filteredData || analyticsData || {};

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Platform Filter */}
          <Select
            value={selectedPlatform}
            onValueChange={setSelectedPlatform}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="instagram">
                <div className="flex items-center gap-2">
                  <Instagram className="h-4 w-4 text-pink-600" />
                  Instagram
                </div>
              </SelectItem>
              <SelectItem value="twitter">
                <div className="flex items-center gap-2">
                  <Twitter className="h-4 w-4 text-blue-400" />
                  Twitter
                </div>
              </SelectItem>
              <SelectItem value="facebook">
                <div className="flex items-center gap-2">
                  <Facebook className="h-4 w-4 text-blue-600" />
                  Facebook
                </div>
              </SelectItem>
              <SelectItem value="linkedin">
                <div className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4 text-blue-700" />
                  LinkedIn
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          
          {/* Date Range Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <span className="hidden sm:inline">Date Range</span>
                {dateRange.from ? (
                  dateRange.to ? (
                    <span>
                      {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d, yyyy")}
                    </span>
                  ) : (
                    format(dateRange.from, "MMM d, yyyy")
                  )
                ) : (
                  <span>Select dates</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={{
                  from: dateRange.from,
                  to: dateRange.to,
                }}
                onSelect={(range) => {
                  setDateRange({
                    from: range?.from,
                    to: range?.to,
                  });
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          {/* Reset Filters Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              setSelectedPlatform("all");
              setDateRange({ from: undefined, to: undefined });
              setSelectedMetric("all");
            }}
            className="ml-auto md:ml-0"
          >
            Reset Filters
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Platform Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={platformPerformance}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="platform" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="engagement" fill="#8884d8" />
                  <Bar dataKey="reach" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={engagementData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {(selectedPlatform === "all" || selectedPlatform === "instagram") && 
                    <Bar dataKey="instagram" fill="#E1306C" name="Instagram" />}
                  {(selectedPlatform === "all" || selectedPlatform === "twitter") && 
                    <Bar dataKey="twitter" fill="#1DA1F2" name="Twitter" />}
                  {(selectedPlatform === "all" || selectedPlatform === "facebook") && 
                    <Bar dataKey="facebook" fill="#4267B2" name="Facebook" />}
                  {(selectedPlatform === "all" || selectedPlatform === "linkedin") && 
                    <Bar dataKey="linkedin" fill="#0077B5" name="LinkedIn" />}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Audience Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredData?.audienceGrowth}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {(selectedPlatform === "all" || selectedPlatform === "instagram") && 
                    <Bar dataKey="instagram" fill="#E1306C" name="Instagram" />}
                  {(selectedPlatform === "all" || selectedPlatform === "twitter") && 
                    <Bar dataKey="twitter" fill="#1DA1F2" name="Twitter" />}
                  {(selectedPlatform === "all" || selectedPlatform === "facebook") && 
                    <Bar dataKey="facebook" fill="#4267B2" name="Facebook" />}
                  {(selectedPlatform === "all" || selectedPlatform === "linkedin") && 
                    <Bar dataKey="linkedin" fill="#0077B5" name="LinkedIn" />}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
