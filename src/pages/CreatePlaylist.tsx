
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AdminSidebar from '@/components/AdminSidebar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';

const CreatePlaylist = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    coverImage: null as File | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a playlist name',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let coverImageUrl = null;

      // Upload cover image if provided
      if (formData.coverImage) {
        const fileExt = formData.coverImage.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('playlist-covers')
          .upload(fileName, formData.coverImage);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('playlist-covers')
          .getPublicUrl(fileName);

        coverImageUrl = publicUrl;
      }

      // Create playlist
      const { error } = await supabase
        .from('playlists')
        .insert([{
          name: formData.name.trim(),
          cover_image_url: coverImageUrl
        }]);

      if (error) throw error;

      toast({
        title: 'Success!',
        description: 'Playlist created successfully',
      });

      // Reset form
      setFormData({ name: '', coverImage: null });
      
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create playlist',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-2xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Playlist</h1>
            <p className="text-gray-600">Add a new playlist to your music collection</p>
          </header>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Playlist Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1"
                  placeholder="Enter playlist name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="cover" className="text-sm font-medium text-gray-700">
                  Cover Image (Optional)
                </Label>
                <div className="mt-1">
                  <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-400 transition-colors">
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">
                        {formData.coverImage ? formData.coverImage.name : 'Click to upload cover image'}
                      </p>
                    </div>
                    <input
                      id="cover"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFormData({ ...formData, coverImage: e.target.files?.[0] || null })}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Playlist'}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreatePlaylist;
