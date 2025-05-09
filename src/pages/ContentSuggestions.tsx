import React, { useState, useEffect } from 'react';
import * as mockApi from '@/lib/mock-data/mock-api';
import ContentSuggestionGenerator from '@/components/ContentSuggestionGenerator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ContentSuggestion } from '@/types/content';
import { Calendar, Clock, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ContentSuggestions: React.FC = () => {
  const [suggestions, setSuggestions] = useState<ContentSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingSuggestion, setEditingSuggestion] = useState<ContentSuggestion | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
    suggestedTags: [] as string[],
    platform: 'instagram' as 'instagram' | 'twitter' | 'facebook' | 'linkedin' | 'all',
    mediaType: 'image' as 'image' | 'video' | 'carousel' | 'text'
  });
  
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        // Use the mock API service to get content suggestions
        const data = await mockApi.getContentSuggestions();
        setSuggestions(data || []);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setError(error instanceof Error ? error.message : 'Failed to load content suggestions');
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSuggestions();
  }, []);
  
  const handleStatusChange = async (id: string, status: 'pending' | 'approved' | 'rejected' | 'published') => {
    try {
      setError(null); // Clear any previous errors
      
      // Update optimistically without waiting for API response
      setSuggestions(suggestions.map(suggestion => 
        suggestion.id === id ? { ...suggestion, status } : suggestion
      ));
      
      // Update using the mock API service
      try {
        await mockApi.updateContentSuggestion(id, { status });
      } catch (apiError) {
        console.warn('API call failed, but UI was updated:', apiError);
      }
    } catch (error) {
      console.error('Error updating suggestion status:', error);
      setError(error instanceof Error ? error.message : 'Failed to update suggestion status');
    }
  };
  
  const handleEditClick = (suggestion: ContentSuggestion) => {
    setEditingSuggestion(suggestion);
    setEditForm({
      title: suggestion.title || '',
      content: suggestion.content || '',
      suggestedTags: suggestion.suggestedTags || [],
      platform: suggestion.platform as 'instagram' | 'twitter' | 'facebook' | 'linkedin' | 'all',
      mediaType: suggestion.mediaType as 'image' | 'video' | 'carousel' | 'text'
    });
    setIsEditDialogOpen(true);
  };
  
  const handleSaveEdit = async () => {
    if (!editingSuggestion) return;
    
    try {
      // Validate form data
      if (!editForm.title.trim()) {
        setError('Title is required');
        return;
      }
      
      if (!editForm.content.trim()) {
        setError('Content is required');
        return;
      }
      
      // Clear any previous errors
      setError(null);
      
      // Update optimistically
      const updatedSuggestion = {
        ...editingSuggestion,
        title: editForm.title.trim(),
        content: editForm.content.trim(),
        suggestedTags: editForm.suggestedTags,
        platform: editForm.platform,
        mediaType: editForm.mediaType,
        updatedAt: new Date().toISOString()
      };
      
      setSuggestions(suggestions.map(suggestion => 
        suggestion.id === editingSuggestion.id ? updatedSuggestion : suggestion
      ));
      
      // Update using the mock API service
      try {
        await mockApi.updateContentSuggestion(editingSuggestion.id!, updatedSuggestion);
      } catch (apiError) {
        console.warn('API call failed, but UI was updated:', apiError);
      }
      
      setIsEditDialogOpen(false);
      setEditingSuggestion(null);
    } catch (error) {
      console.error('Error updating suggestion:', error);
      setError(error instanceof Error ? error.message : 'Failed to update suggestion');
    }
  };
  
  const handleDeleteSuggestion = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this content suggestion?')) return;
    
    try {
      setError(null); // Clear any previous errors
      
      // Store the current suggestions for potential rollback
      const previousSuggestions = [...suggestions];
      
      // Update optimistically
      setSuggestions(suggestions.filter(suggestion => suggestion.id !== id));
      
      // Delete using the mock API service
      try {
        await mockApi.deleteContentSuggestion(id);
      } catch (apiError) {
        console.warn('API call failed, rolling back UI update:', apiError);
        // Roll back the UI update if the API call fails
        setSuggestions(previousSuggestions);
        setError('Failed to delete suggestion. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting suggestion:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete suggestion');
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Rejected</Badge>;
      case 'published':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Published</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return '📸';
      case 'twitter':
        return '🐦';
      case 'facebook':
        return '👍';
      case 'linkedin':
        return '💼';
      case 'all':
        return '🌐';
      default:
        return '📱';
    }
  };
  
  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Content Suggestions</h1>
      
      <Tabs defaultValue="generator" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generator">AI Content Generator</TabsTrigger>
          <TabsTrigger value="library">Content Library</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generator" className="mt-6">
          <ContentSuggestionGenerator />
        </TabsContent>
        
        <TabsContent value="library" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Library</CardTitle>
              <CardDescription>
                Manage your AI-generated content suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="text-center text-red-500 p-4">{error}</div>
              ) : suggestions.length === 0 ? (
                <div className="text-center p-8">
                  <p className="text-muted-foreground mb-4">No content suggestions found</p>
                  <Button onClick={() => {
                    const generatorTab = document.querySelector('[data-value="generator"]') as HTMLElement;
                    if (generatorTab) generatorTab.click();
                  }}>
                    Generate New Content
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {suggestions.map((suggestion) => (
                    <Card key={suggestion.id} className="overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{getPlatformIcon(suggestion.platform)}</span>
                            <div>
                              <h3 className="font-semibold">{suggestion.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {suggestion.platform.charAt(0).toUpperCase() + suggestion.platform.slice(1)} • {suggestion.mediaType}
                              </p>
                            </div>
                          </div>
                          <div>{getStatusBadge(suggestion.status)}</div>
                        </div>
                        
                        <div className="mt-4 p-4 bg-muted/50 rounded-md">
                          <p className="whitespace-pre-wrap">{suggestion.content}</p>
                        </div>
                        
                        {suggestion.suggestedTags && suggestion.suggestedTags.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {suggestion.suggestedTags.map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(suggestion.createdAt || '').toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>Best time: {new Date(suggestion.bestTimeToPost).toLocaleString()}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditClick(suggestion)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          
                          {suggestion.status === 'pending' && (
                            <>
                              <Button 
                                variant="default" 
                                size="sm"
                                onClick={() => handleStatusChange(suggestion.id!, 'approved')}
                              >
                                Approve
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleStatusChange(suggestion.id!, 'rejected')}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          
                          {suggestion.status === 'approved' && (
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => handleStatusChange(suggestion.id!, 'published')}
                            >
                              Publish
                            </Button>
                          )}
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteSuggestion(suggestion.id!)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Edit Dialog */}
      {editingSuggestion && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Content Suggestion</DialogTitle>
              <DialogDescription>
                Update your content suggestion details below.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-platform">Platform</Label>
                  <Select 
                    value={editForm.platform}
                    onValueChange={(value) => setEditForm({...editForm, platform: value as any})}
                  >
                    <SelectTrigger id="edit-platform">
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
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-media-type">Media Type</Label>
                  <Select 
                    value={editForm.mediaType}
                    onValueChange={(value) => setEditForm({...editForm, mediaType: value as any})}
                  >
                    <SelectTrigger id="edit-media-type">
                      <SelectValue placeholder="Select media type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="carousel">Carousel</SelectItem>
                      <SelectItem value="text">Text Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editForm.title}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                  placeholder="Enter a title for your content"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-content">Content</Label>
                <Textarea
                  id="edit-content"
                  value={editForm.content}
                  onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                  placeholder="Enter your content here"
                  rows={6}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-tags">Tags (comma separated)</Label>
                <Input
                  id="edit-tags"
                  value={editForm.suggestedTags.join(', ')}
                  onChange={(e) => setEditForm({
                    ...editForm, 
                    suggestedTags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                  })}
                  placeholder="tag1, tag2, tag3"
                />
              </div>
            </div>
            
            <DialogFooter>
              {error && <p className="text-sm text-red-500 mb-2 w-full text-left">{error}</p>}
              <Button variant="outline" onClick={() => {
                setIsEditDialogOpen(false);
                setError(null); // Clear any errors when closing
              }}>Cancel</Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ContentSuggestions;
