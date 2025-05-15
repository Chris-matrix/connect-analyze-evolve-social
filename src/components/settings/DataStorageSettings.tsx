import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Database, HardDrive, Upload, RefreshCw, Check } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { importMockDataToDatabase } from '@/lib/db/import-data';
import { checkDatabaseConnection, getDatabaseStatus } from '@/lib/db/check-connection';
import DatabaseStatusIndicator from '@/components/ui/DatabaseStatusIndicator';
import { getStorageItem, setStorageItem } from '@/lib/utils/storage';

interface DataStorageSettingsProps {
  initialUseDatabase?: boolean;
}

const DataStorageSettings = ({ initialUseDatabase = false }: DataStorageSettingsProps) => {
  const [useDatabase, setUseDatabase] = useState(initialUseDatabase);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importStatus, setImportStatus] = useState<'idle' | 'importing' | 'success' | 'error'>('idle');
  const [isDataImported, setIsDataImported] = useState(false);
  const [dbConnectionStatus, setDbConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const { toast } = useToast();
  
  // Function to test database connection - wrapped in useCallback to prevent dependency changes
  const testDatabaseConnection = useCallback(async () => {
    try {
      setDbConnectionStatus('connecting');
      
      // First try to connect via the frontend MongoDB connection
      try {
        const { default: connectDB } = await import('@/lib/db/mongodb');
        await connectDB();
      } catch (frontendError) {
        console.warn('Frontend connection attempt failed:', frontendError);
        // Continue to try the API endpoint
      }
      
      // Then verify connection using the API endpoint
      const status = await getDatabaseStatus();
      
      if (status.isConnected) {
        setDbConnectionStatus('connected');
        toast({
          title: "Database connected",
          description: `Successfully connected to MongoDB database (${status.status.name})`,
          duration: 3000,
        });
      } else {
        throw new Error(`Database not connected: ${status.status.status}`);
      }
    } catch (error) {
      console.error('Database connection error:', error);
      setDbConnectionStatus('error');
      toast({
        title: "Database connection failed",
        description: "Could not connect to MongoDB database. Check your connection settings.",
        variant: "destructive",
        duration: 5000,
      });
    }
  }, [toast]);

  // Check if data has been imported on component mount
  useEffect(() => {
    // Check localStorage for import status using safe storage utility
    const importStatus = getStorageItem<string | null>('mockDataImported', null);
    if (importStatus === 'true') {
      setIsDataImported(true);
      setImportStatus('success');
    }
    
    // Check localStorage for database preference using safe storage utility
    const dbPreference = getStorageItem<string | null>('useDatabase', null);
    if (dbPreference !== null) {
      setUseDatabase(dbPreference === 'true');
    }
  }, []);
  
  // Test database connection when useDatabase changes
  useEffect(() => {
    // Only test connection if database is enabled
    if (useDatabase) {
      testDatabaseConnection();
    }
  }, [useDatabase, testDatabaseConnection]);

  // Handle toggling between local storage and database
  const handleStorageToggle = (checked: boolean) => {
    setUseDatabase(checked);
    
    // Use safe storage utility to set the preference
    const success = setStorageItem('useDatabase', checked.toString());
    
    toast({
      title: `Storage mode changed to ${checked ? 'Database' : 'Local Storage'}`,
      description: `Your data will now be stored in ${checked ? 'MongoDB database' : 'browser local storage'}.`,
      duration: 3000,
      variant: success ? 'default' : 'destructive'
    });
    
    if (!success) {
      console.warn('Failed to save storage preference to localStorage');
    }
  };

  // Handle importing mock data to database
  const handleImportData = async () => {
    try {
      // First check database connection
      if (dbConnectionStatus !== 'connected') {
        await testDatabaseConnection();
        
        // If still not connected, abort import
        if (dbConnectionStatus === 'error' || dbConnectionStatus === 'connecting') {
          toast({
            title: "Cannot import data",
            description: "Please ensure database connection is established before importing data.",
            variant: "destructive",
            duration: 3000,
          });
          return;
        }
      }
      
      setIsImporting(true);
      setImportStatus('importing');
      setImportProgress(0);
      
      // Progress callback function
      const onProgress = (progress: number) => {
        setImportProgress(progress);
      };
      
      // Import data
      await importMockDataToDatabase(onProgress);
      
      // Mark as imported
      setIsDataImported(true);
      localStorage.setItem('mockDataImported', 'true');
      
      setImportStatus('success');
      toast({
        title: "Data imported successfully",
        description: "Mock data has been imported to the database.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error importing data:', error);
      setImportStatus('error');
      toast({
        title: "Import failed",
        description: "There was an error importing data to the database.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsImporting(false);
      // Reset progress after a delay if error
      if (importStatus === 'error') {
        setTimeout(() => {
          setImportProgress(0);
          setImportStatus('idle');
        }, 3000);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Data Storage
          </CardTitle>
          {useDatabase && <DatabaseStatusIndicator showDetails={true} />}
        </div>
        <CardDescription>
          Configure how your data is stored and manage database operations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Use MongoDB Database</Label>
            <p className="text-sm text-muted-foreground">
              Toggle between local storage and MongoDB database
            </p>
            {useDatabase && (
              <div className="mt-2 flex items-center">
                <div className={`h-2 w-2 rounded-full mr-2 ${dbConnectionStatus === 'connected' ? 'bg-green-500' : dbConnectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className="text-xs text-muted-foreground">
                  {dbConnectionStatus === 'connected' ? 'Connected to MongoDB' : 
                   dbConnectionStatus === 'connecting' ? 'Connecting to MongoDB...' : 
                   'Connection failed'}
                </span>
                {dbConnectionStatus === 'error' && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-2 h-6 px-2 text-xs"
                    onClick={testDatabaseConnection}
                  >
                    Retry
                  </Button>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="database-toggle" className="text-sm">
              <HardDrive className="h-4 w-4 inline mr-1" /> Local
            </Label>
            <Switch 
              id="database-toggle" 
              checked={useDatabase}
              onCheckedChange={handleStorageToggle}
            />
            <Label htmlFor="database-toggle" className="text-sm">
              <Database className="h-4 w-4 inline mr-1" /> Database
            </Label>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Import Mock Data</Label>
              <p className="text-sm text-muted-foreground">
                Import website mock data into the MongoDB database
              </p>
              {isDataImported && (
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <Check className="h-3 w-3 mr-1" />
                  Data has been imported successfully
                </p>
              )}
            </div>
            <Button 
              onClick={handleImportData} 
              disabled={isImporting || !useDatabase || (isDataImported && importStatus === 'success') || dbConnectionStatus === 'error'}
              variant={useDatabase ? "default" : "outline"}
            >
              {isImporting ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : isDataImported || importStatus === 'success' ? (
                <Check className="h-4 w-4 mr-2" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              {isImporting ? 'Importing...' : 
               isDataImported || importStatus === 'success' ? 'Data Imported' : 
               'Import Data'}
            </Button>
          </div>
          
          {isImporting && (
            <div className="space-y-2">
              <Progress value={importProgress} className="h-2" />
              <p className="text-xs text-muted-foreground text-right">{importProgress}% complete</p>
            </div>
          )}
          
          {importStatus === 'error' && (
            <Alert variant="destructive">
              <AlertTitle>Import Failed</AlertTitle>
              <AlertDescription>
                There was an error importing data to the database. Please check the console for more details.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 border-t px-6 py-3">
        <p className="text-xs text-muted-foreground">
          {useDatabase 
            ? "Using database storage. Your data will persist across browser sessions and devices."
            : "Using local storage. Your data will only be available on this device and browser."}
        </p>
      </CardFooter>
    </Card>
  );
};

export default DataStorageSettings;
