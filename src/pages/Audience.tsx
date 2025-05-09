
import React, { useState, useEffect } from 'react';
import { Users, Loader2, UserCheck, MapPin, Globe, Activity, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import FollowerGrowthChart from '@/components/FollowerGrowthChart';
import * as mockApi from '@/lib/mock-data/mock-api';
import { AudienceData } from '@/types/dashboard';

const Audience = () => {
  const [loading, setLoading] = useState(true);
  const [audienceData, setAudienceData] = useState<AudienceData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [platform, setPlatform] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('30d');
  const [selectedDemographics, setSelectedDemographics] = useState<string[]>(['all']);
  const [selectedLocations, setSelectedLocations] = useState<string[]>(['all']);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#83a6ed'];

  // Mock follower growth data
  const [followerGrowthData, setFollowerGrowthData] = useState([
    { date: '2025-04-09', instagram: 1200, twitter: 800, facebook: 1500, linkedin: 600 },
    { date: '2025-04-10', instagram: 1210, twitter: 805, facebook: 1510, linkedin: 610 },
    { date: '2025-04-11', instagram: 1215, twitter: 815, facebook: 1520, linkedin: 615 },
    { date: '2025-04-12', instagram: 1225, twitter: 825, facebook: 1525, linkedin: 620 },
    { date: '2025-04-13', instagram: 1235, twitter: 830, facebook: 1530, linkedin: 625 },
    { date: '2025-04-14', instagram: 1240, twitter: 835, facebook: 1535, linkedin: 630 },
    { date: '2025-04-15', instagram: 1245, twitter: 840, facebook: 1540, linkedin: 635 },
    { date: '2025-04-16', instagram: 1250, twitter: 845, facebook: 1545, linkedin: 640 },
    { date: '2025-04-17', instagram: 1255, twitter: 850, facebook: 1550, linkedin: 645 },
    { date: '2025-04-18', instagram: 1260, twitter: 855, facebook: 1555, linkedin: 650 },
    { date: '2025-04-19', instagram: 1265, twitter: 860, facebook: 1560, linkedin: 655 },
    { date: '2025-04-20', instagram: 1270, twitter: 865, facebook: 1565, linkedin: 660 },
    { date: '2025-04-21', instagram: 1275, twitter: 870, facebook: 1570, linkedin: 665 },
    { date: '2025-04-22', instagram: 1280, twitter: 875, facebook: 1575, linkedin: 670 },
    { date: '2025-04-23', instagram: 1285, twitter: 880, facebook: 1580, linkedin: 675 },
    { date: '2025-04-24', instagram: 1290, twitter: 885, facebook: 1585, linkedin: 680 },
    { date: '2025-04-25', instagram: 1295, twitter: 890, facebook: 1590, linkedin: 685 },
    { date: '2025-04-26', instagram: 1300, twitter: 895, facebook: 1595, linkedin: 690 },
    { date: '2025-04-27', instagram: 1305, twitter: 900, facebook: 1600, linkedin: 695 },
    { date: '2025-04-28', instagram: 1310, twitter: 905, facebook: 1605, linkedin: 700 },
    { date: '2025-04-29', instagram: 1315, twitter: 910, facebook: 1610, linkedin: 705 },
    { date: '2025-04-30', instagram: 1320, twitter: 915, facebook: 1615, linkedin: 710 },
    { date: '2025-05-01', instagram: 1325, twitter: 920, facebook: 1620, linkedin: 715 },
    { date: '2025-05-02', instagram: 1330, twitter: 925, facebook: 1625, linkedin: 720 },
    { date: '2025-05-03', instagram: 1335, twitter: 930, facebook: 1630, linkedin: 725 },
    { date: '2025-05-04', instagram: 1340, twitter: 935, facebook: 1635, linkedin: 730 },
    { date: '2025-05-05', instagram: 1345, twitter: 940, facebook: 1640, linkedin: 735 },
    { date: '2025-05-06', instagram: 1350, twitter: 945, facebook: 1645, linkedin: 740 },
    { date: '2025-05-07', instagram: 1355, twitter: 950, facebook: 1650, linkedin: 745 },
    { date: '2025-05-08', instagram: 1360, twitter: 955, facebook: 1655, linkedin: 750 },
    { date: '2025-05-09', instagram: 1365, twitter: 960, facebook: 1660, linkedin: 755 },
  ]);

  useEffect(() => {
    const fetchAudienceData = async () => {
      try {
        // In a real app, you would pass platform and dateRange to the API
        const data = await mockApi.getAudienceData();
        setAudienceData(data);
      } catch (error) {
        console.error('Error fetching audience data:', error);
        setError('Failed to load audience data');
      } finally {
        setLoading(false);
      }
    };

    fetchAudienceData();
  }, [platform, dateRange]); // Re-fetch when filters change

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading audience data...</span>
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

  const { demographics, geographics, interests, engagement } = audienceData;

  // Filter data based on selected platform
  const filterDataByPlatform = (data: unknown): unknown => {
    if (platform === 'all') return data;
    
    // This is a simplified example. In a real app, you would filter the actual data
    // based on the selected platform
    return data;
  };

  const toggleDemographic = (value: string) => {
    if (value === 'all') {
      setSelectedDemographics(['all']);
      return;
    }
    
    // Remove 'all' if it's selected
    let newSelection = selectedDemographics.filter(item => item !== 'all');
    
    if (newSelection.includes(value)) {
      newSelection = newSelection.filter(item => item !== value);
    } else {
      newSelection.push(value);
    }
    
    // If nothing is selected, default to 'all'
    setSelectedDemographics(newSelection.length ? newSelection : ['all']);
  };

  const toggleLocation = (value: string) => {
    if (value === 'all') {
      setSelectedLocations(['all']);
      return;
    }
    
    // Remove 'all' if it's selected
    let newSelection = selectedLocations.filter(item => item !== 'all');
    
    if (newSelection.includes(value)) {
      newSelection = newSelection.filter(item => item !== value);
    } else {
      newSelection.push(value);
    }
    
    // If nothing is selected, default to 'all'
    setSelectedLocations(newSelection.length ? newSelection : ['all']);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Audience</h1>
        
        <div className="flex flex-wrap gap-2">
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Advanced Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Demographics</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="all-demographics" 
                        checked={selectedDemographics.includes('all')} 
                        onCheckedChange={() => toggleDemographic('all')}
                      />
                      <Label htmlFor="all-demographics">All Demographics</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="18-24" 
                        checked={selectedDemographics.includes('18-24')} 
                        onCheckedChange={() => toggleDemographic('18-24')}
                      />
                      <Label htmlFor="18-24">18-24</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="25-34" 
                        checked={selectedDemographics.includes('25-34')} 
                        onCheckedChange={() => toggleDemographic('25-34')}
                      />
                      <Label htmlFor="25-34">25-34</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="35-44" 
                        checked={selectedDemographics.includes('35-44')} 
                        onCheckedChange={() => toggleDemographic('35-44')}
                      />
                      <Label htmlFor="35-44">35-44</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="45+" 
                        checked={selectedDemographics.includes('45+')} 
                        onCheckedChange={() => toggleDemographic('45+')}
                      />
                      <Label htmlFor="45+">45+</Label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Locations</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="all-locations" 
                        checked={selectedLocations.includes('all')} 
                        onCheckedChange={() => toggleLocation('all')}
                      />
                      <Label htmlFor="all-locations">All Locations</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="us" 
                        checked={selectedLocations.includes('us')} 
                        onCheckedChange={() => toggleLocation('us')}
                      />
                      <Label htmlFor="us">United States</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="europe" 
                        checked={selectedLocations.includes('europe')} 
                        onCheckedChange={() => toggleLocation('europe')}
                      />
                      <Label htmlFor="europe">Europe</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="asia" 
                        checked={selectedLocations.includes('asia')} 
                        onCheckedChange={() => toggleLocation('asia')}
                      />
                      <Label htmlFor="asia">Asia</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="other" 
                        checked={selectedLocations.includes('other')} 
                        onCheckedChange={() => toggleLocation('other')}
                      />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">{audienceData.totalFollowers.toLocaleString()}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Across all platforms</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Followers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <UserCheck className="h-5 w-5 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">{audienceData.activeFollowers.toLocaleString()}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{audienceData.activePercentage}% engagement rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">{audienceData.topLocation}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{audienceData.topLocationPercentage}% of audience</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Activity className="h-5 w-5 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">{audienceData.growthRate}%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Month over month</p>
          </CardContent>
        </Card>
      </div>

      {/* Follower Growth Chart */}
      <FollowerGrowthChart data={followerGrowthData} />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="geography">Geography</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="text-2xl font-bold">{audienceData.totalFollowers.toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Across all platforms</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Followers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <UserCheck className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="text-2xl font-bold">{audienceData.activeFollowers.toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{audienceData.activePercentage}% engagement rate</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Top Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="text-2xl font-bold">{audienceData.topLocation}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{audienceData.topLocationPercentage}% of audience</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Activity className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="text-2xl font-bold">{audienceData.growthRate}%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Month over month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Interests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={interests}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {interests.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={engagement}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {engagement.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="demographics" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Demographics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={demographics}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {demographics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

        </TabsContent>
        
        <TabsContent value="geography" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={geographics}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {geographics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Top Cities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { city: 'New York', country: 'United States', percentage: 15 },
                  { city: 'London', country: 'United Kingdom', percentage: 12 },
                  { city: 'Los Angeles', country: 'United States', percentage: 10 },
                  { city: 'Toronto', country: 'Canada', percentage: 8 },
                  { city: 'Sydney', country: 'Australia', percentage: 7 },
                ].map((city, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{city.city}</p>
                      <p className="text-sm text-muted-foreground">{city.country}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${city.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{city.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Audience;
