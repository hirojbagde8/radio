
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AdminSidebar from '@/components/AdminSidebar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload } from 'lucide-react';

const UploadSongs = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    artist: '',
    playlistId: '',
    audioFile: null as File | null
  });

  const { data: playlists, isLoading: playlistsLoading } = useQuery({
    queryKey: ['playlists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.artist.trim() || !formData.audioFile || !formData.playlistId) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload audio file
      const fileExt = formData.audioFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('songs')
        .upload(fileName, formData.audioFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('songs')
        .getPublicUrl(fileName);

      // Create song record
      const { error } = await supabase
        .from('songs')
        .insert([{
          name: formData.name.trim(),
          artist: formData.artist.trim(),
          file_url: publicUrl,
          playlist_id: formData.playlistId
        }]);

      if (error) throw error;

      toast({
        title: 'Success!',
        description: 'Song uploaded successfully',
      });

      // Reset form
      setFormData({ name: '', artist: '', playlistId: '', audioFile: null });
      
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload song',
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Songs</h1>
            <p className="text-gray-600">Add new songs to your playlists</p>
          </header>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            {playlistsLoading ? (
              <LoadingSpinner />
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Song Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1"
                    placeholder="Enter song name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="artist" className="text-sm font-medium text-gray-700">
                    Artist Name *
                  </Label>
                  <Input
                    id="artist"
                    type="text"
                    value={formData.artist}
                    onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                    className="mt-1"
                    placeholder="Enter artist name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="playlist" className="text-sm font-medium text-gray-700">
                    Playlist *
                  </Label>
                  <Select value={formData.playlistId} onValueChange={(value) => setFormData({ ...formData, playlistId: value })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a playlist" />
                    </SelectTrigger>
                    <SelectContent>
                      {playlists?.map((playlist) => (
                        <SelectItem key={playlist.id} value={playlist.id}>
                          {playlist.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="audio" className="text-sm font-medium text-gray-700">
                    Audio File *
                  </Label>
                  <div className="mt-1">
                    <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-400 transition-colors">
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">
                          {formData.audioFile ? formData.audioFile.name : 'Click to upload audio file'}
                        </p>
                      </div>
                      <input
                        id="audio"
                        type="file"
                        accept="audio/*"
                        onChange={(e) => setFormData({ ...formData, audioFile: e.target.files?.[0] || null })}
                        className="hidden"
                        required
                      />
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  disabled={isSubmitting || !playlists?.length}
                >
                  {isSubmitting ? 'Uploading...' : 'Upload Song'}
                </Button>

                {!playlists?.length && (
                  <p className="text-sm text-gray-500 text-center">
                    You need to create a playlist first before uploading songs.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UploadSongs;
