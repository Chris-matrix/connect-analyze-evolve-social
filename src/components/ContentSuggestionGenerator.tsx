import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import * as mockApi from '@/lib/mock-data/mock-api';
import { ContentSuggestion } from '@/types/content';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  platform: z.enum(['instagram', 'twitter', 'facebook', 'linkedin', 'all']),
  topic: z.string().min(3, 'Topic must be at least 3 characters'),
  tone: z.enum(['professional', 'casual', 'humorous', 'inspirational']),
  mediaType: z.enum(['image', 'video', 'carousel', 'text']),
  targetAudience: z.string().optional(),
  includeHashtags: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

const ContentSuggestionGenerator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<ContentSuggestion | null>(null);
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platform: 'instagram',
      tone: 'professional',
      mediaType: 'image',
      includeHashtags: true,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setError(null);
    setSuggestion(null);
    
    try {
      // Use the mock API service to generate content
      const params = {
        platform: data.platform!,
        topic: data.topic!,
        tone: data.tone,
        mediaType: data.mediaType,
        targetAudience: data.targetAudience,
        includeHashtags: data.includeHashtags
      };
      
      const result = await mockApi.generateAiContentSuggestion(params);
      setSuggestion(result);
    } catch (error: unknown) {
      console.error('Error in content generation:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to generate content suggestion'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    reset();
    setSuggestion(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Content Generator</CardTitle>
          <CardDescription>
            Generate AI-powered content suggestions for your social media platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select 
                defaultValue="instagram"
                onValueChange={(value: string) => setValue('platform', value as 'instagram' | 'twitter' | 'facebook' | 'linkedin' | 'all')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="all">All Platforms</SelectItem>
                </SelectContent>
              </Select>
              {errors.platform && (
                <p className="text-sm text-red-500">{errors.platform.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="topic">Topic or Theme</Label>
              <Input
                id="topic"
                placeholder="e.g., Product launch, Industry trends, Tips and tricks"
                {...register('topic')}
              />
              {errors.topic && (
                <p className="text-sm text-red-500">{errors.topic.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Content Tone</Label>
              <RadioGroup 
                defaultValue="professional"
                onValueChange={(value: string) => setValue('tone', value as 'professional' | 'casual' | 'humorous' | 'inspirational')}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="professional" id="tone-professional" />
                  <Label htmlFor="tone-professional">Professional</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="casual" id="tone-casual" />
                  <Label htmlFor="tone-casual">Casual</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="humorous" id="tone-humorous" />
                  <Label htmlFor="tone-humorous">Humorous</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="inspirational" id="tone-inspirational" />
                  <Label htmlFor="tone-inspirational">Inspirational</Label>
                </div>
              </RadioGroup>
              {errors.tone && (
                <p className="text-sm text-red-500">{errors.tone.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Media Type</Label>
              <RadioGroup 
                defaultValue="image"
                onValueChange={(value: string) => setValue('mediaType', value as 'image' | 'video' | 'carousel' | 'text')}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="image" id="media-image" />
                  <Label htmlFor="media-image">Image</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="video" id="media-video" />
                  <Label htmlFor="media-video">Video</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="carousel" id="media-carousel" />
                  <Label htmlFor="media-carousel">Carousel</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="text" id="media-text" />
                  <Label htmlFor="media-text">Text Only</Label>
                </div>
              </RadioGroup>
              {errors.mediaType && (
                <p className="text-sm text-red-500">{errors.mediaType.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="targetAudience">Target Audience (Optional)</Label>
              <Input
                id="targetAudience"
                placeholder="e.g., Professionals, Young adults, Tech enthusiasts"
                {...register('targetAudience')}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="includeHashtags"
                checked={watch('includeHashtags')}
                onCheckedChange={(checked) => setValue('includeHashtags', checked)}
              />
              <Label htmlFor="includeHashtags">Include hashtags</Label>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex space-x-2">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : 'Generate Content'}
              </Button>
              <Button type="button" variant="outline" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {suggestion && (
        <Card>
          <CardHeader>
            <CardTitle>{suggestion.title}</CardTitle>
            <CardDescription>
              AI-generated content for {suggestion.platform} • Score: {suggestion.aiGeneratedScore}/100
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground">Content</Label>
              <div className="mt-1 p-4 border rounded-md whitespace-pre-wrap">
                {suggestion.content}
              </div>
            </div>
            
            {suggestion.suggestedTags && suggestion.suggestedTags.length > 0 && (
              <div>
                <Label className="text-sm text-muted-foreground">Suggested Tags</Label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {suggestion.suggestedTags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Media Type</Label>
                <div className="mt-1 font-medium">{suggestion.mediaType}</div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Best Time to Post</Label>
                <div className="mt-1 font-medium">
                  {new Date(suggestion.bestTimeToPost).toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline">Edit</Button>
            <Button>Save to Library</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ContentSuggestionGenerator;
