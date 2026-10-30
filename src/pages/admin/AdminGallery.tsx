import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { saveWeddingPhoto, deleteWeddingPhoto, uploadMediaFile } from '../../services/weddingService';
import { WeddingPhoto } from '../../types/wedding';
import { 
  Images, 
  Upload, 
  Trash2, 
  Eye, 
  EyeOff, 
  Star, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Edit3,
  X,
  Save
} from 'lucide-react';

export const AdminGallery: React.FC = () => {
  const { photos, refreshData } = useWedding();
  const [uploading, setUploading] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Partial<WeddingPhoto> | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Gallery and couple photos
  const galleryPhotos = photos.filter(p => p.category !== 'after_wedding');

  const handleMultipleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const res = await uploadMediaFile(file, 'gallery');
      if (res.success && res.url) {
        await saveWeddingPhoto({
          category: 'gallery',
          photo_url: res.url,
          caption: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
          display_order: galleryPhotos.length + i + 1,
          is_published: true,
          is_cover: false
        });
        successCount++;
      }
    }

    await refreshData();
    setUploading(false);
    setMessage({ text: `Successfully uploaded ${successCount} photograph(s)!`, type: 'success' });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this photograph?')) return;
    const res = await deleteWeddingPhoto(id);
    if (res.success) {
      await refreshData();
      setMessage({ text: 'Photograph removed.', type: 'success' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleTogglePublish = async (photo: WeddingPhoto) => {
    await saveWeddingPhoto({
      id: photo.id,
      is_published: !photo.is_published
    });
    await refreshData();
  };

  const handleSetCover = async (photo: WeddingPhoto) => {
    // Unset other covers in category
    for (const p of galleryPhotos) {
      if (p.is_cover && p.id !== photo.id) {
        await saveWeddingPhoto({ id: p.id, is_cover: false });
      }
    }
    await saveWeddingPhoto({ id: photo.id, is_cover: true });
    await refreshData();
    setMessage({ text: 'Cover photograph updated.', type: 'success' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto) return;
    const res = await saveWeddingPhoto(editingPhoto);
    if (res.success) {
      setEditingPhoto(null);
      await refreshData();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-couple text-2xl sm:text-3xl font-bold text-maroon">
            Couple Photo Gallery
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-heading">
            Upload high-resolution couple photographs, assign captions, and select cover pictures.
          </p>
        </div>

        <div>
          <label className="btn-royal-maroon px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center space-x-2 shadow-sm cursor-pointer">
            <Upload className="w-4 h-4 text-gold" />
            <span>{uploading ? 'Compressing & Uploading...' : 'Upload Photos'}</span>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              disabled={uploading}
              onChange={handleMultipleUpload}
            />
          </label>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-sm flex items-center space-x-2 ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5 text-red-600" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Photos Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {galleryPhotos.map((photo) => (
          <div
            key={photo.id}
            className={`bg-white rounded-xl border overflow-hidden shadow-sm flex flex-col justify-between group relative ${
              photo.is_published ? 'border-gray-200' : 'border-gray-300 opacity-60'
            }`}
          >
            {/* Image Thumbnail */}
            <div className="relative aspect-square bg-gray-100 overflow-hidden">
              <img
                src={photo.photo_url}
                alt={photo.caption || 'Photo'}
                className="w-full h-full object-cover"
                loading="lazy"
              />

              {/* Cover Badge */}
              {photo.is_cover && (
                <div className="absolute top-2 left-2 bg-gold text-maroon text-[10px] font-bold px-2 py-0.5 rounded-md shadow flex items-center space-x-1">
                  <Star className="w-3 h-3 fill-maroon" />
                  <span>Cover</span>
                </div>
              )}

              {/* Action Overlay */}
              <div className="absolute top-2 right-2 flex items-center space-x-1">
                <button
                  onClick={() => handleTogglePublish(photo)}
                  className={`p-1.5 rounded-lg text-xs backdrop-blur-md cursor-pointer ${
                    photo.is_published ? 'bg-white/90 text-green-700' : 'bg-black/60 text-white'
                  }`}
                  title={photo.is_published ? 'Published' : 'Hidden'}
                >
                  {photo.is_published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Metadata & Controls */}
            <div className="p-3">
              <p className="text-xs font-medium text-gray-800 truncate mb-1" title={photo.caption}>
                {photo.caption || 'Untitled photograph'}
              </p>
              <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-gray-100 mt-2">
                <button
                  onClick={() => setEditingPhoto({ ...photo })}
                  className="hover:text-gold-deep flex items-center space-x-1 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>

                {!photo.is_cover && (
                  <button
                    onClick={() => handleSetCover(photo)}
                    className="hover:text-gold-deep text-[10px] cursor-pointer"
                  >
                    Set as Cover
                  </button>
                )}

                <button
                  onClick={() => handleDelete(photo.id)}
                  className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Photo Details Modal */}
      {editingPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          style={{ overscrollBehavior: 'contain' }}
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-couple text-lg font-bold text-maroon">
                Edit Photograph Details
              </h3>
              <button 
                onClick={() => setEditingPhoto(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDetails} className="space-y-4">
              <div className="w-full h-40 rounded-xl overflow-hidden bg-gray-100 mb-3 border">
                <img
                  src={editingPhoto.photo_url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Caption
                </label>
                <input
                  type="text"
                  value={editingPhoto.caption || ''}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, caption: e.target.value })}
                  placeholder="e.g. Under the Palace Arches"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Alt Text (for Accessibility)
                </label>
                <input
                  type="text"
                  value={editingPhoto.alt_text || ''}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, alt_text: e.target.value })}
                  placeholder="Descriptive text for screen readers"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="photoPublished"
                    checked={editingPhoto.is_published ?? true}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, is_published: e.target.checked })}
                    className="rounded border-gray-300 text-maroon focus:ring-gold"
                  />
                  <label htmlFor="photoPublished" className="text-xs text-gray-700 font-medium">
                    Published
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-xs text-gray-500 font-medium">Display Order:</label>
                  <input
                    type="number"
                    min="1"
                    value={editingPhoto.display_order || 1}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, display_order: Number(e.target.value) })}
                    className="w-16 px-2 py-1 text-xs border rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingPhoto(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-royal-maroon px-5 py-2 rounded-xl text-xs font-semibold inline-flex items-center space-x-1.5 shadow cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5 text-gold" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
