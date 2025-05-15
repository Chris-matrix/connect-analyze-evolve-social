# MongoDB Database Integration

This directory contains the MongoDB database integration for the Social Media Dashboard application.

## Connection Setup

The MongoDB connection is configured in `mongodb.ts`. It uses the following environment variables:

- `MONGODB_URI`: The MongoDB connection string (defaults to `mongodb://localhost:27017/?appName=MongoDB+Compass&directConnection=true&serverSelectionTimeoutMS=2000`)
- `DB_NAME`: The name of the database (defaults to `social-dashboard`)

## Data Storage Settings

The application supports toggling between local storage and MongoDB database for data persistence. This feature is implemented through:

- `DataStorageContext.tsx`: Provides a React context for managing data storage preferences
- `useDataStorage.ts`: Custom hook for accessing the data storage context
- `import-data.ts`: Handles importing mock data into the database and checking storage preferences

### Using the Data Storage Context

```typescript
import { useDataStorage } from '@/lib/db/useDataStorage';

const MyComponent = () => {
  const { useDatabase, setUseDatabase, isDataImported, setIsDataImported, loading } = useDataStorage();
  
  // Check if the application is using database storage
  if (useDatabase) {
    // Perform database operations
  } else {
    // Use local storage
  }
  
  // Toggle between database and local storage
  const handleToggleStorage = () => {
    setUseDatabase(!useDatabase);
  };
  
  return (
    <div>
      <button onClick={handleToggleStorage}>
        {useDatabase ? 'Switch to Local Storage' : 'Switch to Database'}
      </button>
    </div>
  );
};
```

### Importing Mock Data

```typescript
import { importMockDataToDatabase } from '@/lib/db/import-data';

// Import mock data with progress tracking
const handleImportData = async () => {
  try {
    // Progress callback function
    const onProgress = (progress: number) => {
      console.log(`Import progress: ${progress}%`);
    };
    
    // Import data
    await importMockDataToDatabase(onProgress);
    console.log('Data imported successfully');
  } catch (error) {
    console.error('Error importing data:', error);
  }
};
```

## Database Structure

### Models

The database models are defined in the `models` directory:

- `User`: User accounts and authentication
- `SocialProfile`: Connected social media profiles
- `SocialMetrics`: Social media metrics data
- `ContentSuggestion`: AI-generated content suggestions

### Services

Database operations are handled through service classes in the `services` directory:

- `userService`: User account operations
- `socialProfileService`: Social profile operations
- `socialMetricsService`: Social metrics operations
- `contentSuggestionService`: Content suggestion operations

## Usage Examples

### Connecting to the Database

```typescript
import connectDB from '@/lib/db/mongodb';

// Connect to the database
await connectDB();
```

### Using Database Services

```typescript
import { userService, socialProfileService } from '@/lib/db/services';

// Get a user by email
const user = await userService.getUserByEmail('user@example.com');

// Get social profiles for a user
const profiles = await socialProfileService.getProfilesByUserId(userId);

// Add a new social profile
const newProfile = await socialProfileService.addProfile({
  userId,
  platform: 'twitter',
  username: 'twitteruser',
  isConnected: true
});
```

### Direct Model Access

```typescript
import { Models } from '@/lib/db/models';

// Get the User model
const UserModel = Models.User();

// Create a new user directly with the model
const newUser = await UserModel.create({
  name: 'John Doe',
  email: 'john@example.com',
  password: hashedPassword,
  role: 'user'
});
```

## Error Handling

All service methods include try/catch blocks to handle database errors. In your application code, you should handle any errors thrown by the services:

```typescript
try {
  const user = await userService.getUserById(userId);
  // Use the user data
} catch (error) {
  console.error('Error fetching user:', error);
  // Handle the error appropriately
}
```
