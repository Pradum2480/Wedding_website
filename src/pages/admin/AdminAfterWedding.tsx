import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { useNotification } from '../../context/NotificationContext';
import { 
  saveWeddingAlbum, 
  deleteWeddingAlbum, 
  saveWeddingPhoto, 
  deleteWeddingPhoto, 
  uploadMediaFile,
  validateMediaFile 
} from '../../services/weddingService';
import { WeddingAlbum, WeddingPhoto } from '../../types/wedding';
import { 
  FolderHeart, 
  Plus, 
  Upload, 
  Trash2, 
  Edit3, 
  Images, 
  X, 
  Save, 
  AlertCircle 
} from 'lucide-react';

export const AdminAfterWedding: React.FC = () => {
  const { albums, photos, refreshData } = useWedding();
  const { showSuccess, showError } = useNotification();
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>(albums[0]?.id || '');
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Partial<WeddingAlbum> | null>(null);
  const [orderInput, setOrderInput] = useState<string>('1');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [modalError, setModalError] = useState<string | null>(null);

  // Synchronize selectedAlbumId when albums list loads or changes
  React.useEffect(() => {
    if (albums.length > 0 && (!selectedAlbumId || !albums.some(a => a.id === selectedAlbumId))) {
      setSelectedAlbumId(albums[0].id);
    }
  }, [albums, selectedAlbumId]);

  // Photos belonging to after_wedding and the selected album (including unassigned in first album)
  const currentAlbumPhotos = photos.filter(p => 
    p.category === 'after_wedding' && 
    (selectedAlbumId ? (p.album_id === selectedAlbumId || (!p.album_id && selectedAlbumId === albums[0]?.id)) : true)
  );

  const selectedAlbum = albums.find(a => a.id === selectedAlbumId);

  const handleOpenAddAlbum = () => {
    const nextOrder = albums.length + 1;
    setEditingAlbum({
      title: '',
      description: '',
      cover_photo_url: '',
      display_order: nextOrder,
      is_published: true
    });
    setOrderInput(String(nextOrder));
    setModalError(null);
    setIsAlbumModalOpen(true);
  };

  const handleOpenEditAlbum = (album: WeddingAlbum) => {
    setEditingAlbum({ ...album });
    setOrderInput(String(album.display_order ?? 1));
    setModalError(null);
    setIsAlbumModalOpen(true);
  };

  const handleDeleteAlbum = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete album "${title}" and all its photos?`)) return;
    const res = await deleteWeddingAlbum(id);
    if (res.success) {
      await refreshData();
      if (selectedAlbumId === id) {
        setSelectedAlbumId(albums[0]?.id || '');
      }
      showSuccess(`Album "${title}" removed successfully.`);
    } else {
      showError(res.error || 'Failed to remove album.');
    }
  };

  const handleSaveAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    if (!editingAlbum?.title?.trim()) {
      setModalError('Album Title is required.');
      return;
    }

    const cleanOrder = Math.max(1, Math.min(albums.length + (editingAlbum.id ? 0 : 1), Math.floor(Number(orderInput) || 1)));

    const res = await saveWeddingAlbum({
      ...editingAlbum,
      title: editingAlbum.title.trim(),
      display_order: cleanOrder
    });

    if (res.success) {
      // Automatic dialog closing on success
      setIsAlbumModalOpen(false);
      setEditingAlbum(null);
      setModalError(null);
      await refreshData();
      if (res.data?.id) setSelectedAlbumId(res.data.id);
      showSuccess(
        editingAlbum.id ? 'Album updated successfully!' : 'Album created successfully!',
        'Album Saved'
      );
    } else {
      // Keep dialog open on failure
      setModalError(res.error || 'Failed to save album.');
    }
  };

  const handleUploadPhotosToAlbum = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFiles = e.target.files;
    if (!rawFiles || rawFiles.length === 0) return;
    const files = Array.from(rawFiles);
    e.target.value = '';

    const targetAlbumId = selectedAlbumId || albums[0]?.id;
    if (!targetAlbumId) {
      showError('Please select or create an album before uploading photographs.');
      return;
    }

    setUploading(true);
    let count = 0;
    const errors: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress(`Uploading ${i + 1} of ${files.length}: ${file.name}...`);

      const validation = validateMediaFile(file, 'image');
      if (!validation.isValid) {
        errors.push(`${file.name}: ${validation.error}`);
        continue;
      }

      const res = await uploadMediaFile(file, 'after_wedding');
      if (res.success && res.url) {
        const saveRes = await saveWeddingPhoto({
          album_id: targetAlbumId,
          category: 'after_wedding',
          photo_url: res.url,
          caption: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
          photo_date: new Date().toISOString().split('T')[0],
          display_order: currentAlbumPhotos.length + count + 1,
          is_published: true,
          is_cover: false
        });
        if (saveRes.success) {
          count++;
        } else {
          errors.push(`${file.name}: ${saveRes.error || 'Failed to save record'}`);
        }
      } else {
        errors.push(`${file.name}: ${res.error || 'Upload failed'}`);
      }
    }

    await refreshData();
    setUploading(false);
    setUploadProgress('');

    if (count > 0) {
      showSuccess(`Uploaded ${count} photograph${count > 1 ? 's' : ''} to "${selectedAlbum?.title || 'album'}"!`, 'Photos Added');
    }
    if (errors.length > 0) {
      showError(`${errors.length} file(s) failed: ${errors[0]}`);
    }
  };

  const handleDeletePhoto = async (id: string) => {
    if (!window.confirm('Delete this photograph from the album?')) return;
    const res = await deleteWeddingPhoto(id);
    if (res.success) {
      await refreshData();
      showSuccess('Photograph removed from album.');
    } else {
      showError(res.error || 'Failed to remove photograph.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-couple text-2xl sm:text-3xl font-bold text-maroon">
            After-Wedding Albums &amp; Memories
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-heading">
            Permanent memory keeper: create custom albums (e.g. Pheras, Sangeet, Reception) and upload photos post-ceremony.
          </p>
        </div>

        <button
          onClick={handleOpenAddAlbum}
          className="btn-royal-maroon px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center space-x-2 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 text-gold" />
          <span>Create New Album</span>
        </button>
      </div>

      {/* Album Selector Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-wrap items-center gap-2">
        {albums.map((album) => (
          <div
            key={album.id}
            className={`flex items-center rounded-xl border text-xs font-medium pl-3 pr-1 py-1 transition-all ${
              selectedAlbumId === album.id
                ? 'bg-maroon text-gold border-gold shadow'
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <button
              onClick={() => setSelectedAlbumId(album.id)}
              className="font-semibold mr-2 cursor-pointer"
            >
              {album.title}
            </button>
            <div className="flex items-center space-x-0.5">
              <button
                onClick={() => handleOpenEditAlbum(album)}
                className="p-1 text-gray-400 hover:text-gold cursor-pointer"
                title="Edit Album"
              >
                <Edit3 className="w-3 h-3" />
              </button>
              <button
                onClick={() => handleDeleteAlbum(album.id, album.title)}
                className="p-1 text-red-400 hover:text-red-600 cursor-pointer"
                title="Delete Album"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Album Details & Upload Bar */}
      {selectedAlbum && (
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-couple text-xl font-bold text-gray-900">
              {selectedAlbum.title}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {selectedAlbum.description || 'No description provided.'}
            </p>
          </div>

          <div>
            <label className="btn-royal-maroon px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center space-x-2 shadow cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-gold" />
              <span>{uploading ? (uploadProgress || 'Uploading...') : 'Upload Photos to Album'}</span>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                disabled={uploading}
                onChange={handleUploadPhotosToAlbum}
              />
            </label>
          </div>
        </div>
      )}

      {/* Photos in Album */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {currentAlbumPhotos.map((photo) => (
          <div
            key={photo.id}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between group relative"
          >
            <div className="aspect-square bg-gray-100 overflow-hidden relative">
              <img
                src={photo.photo_url}
                alt={photo.caption || 'Album Photo'}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <button
                onClick={() => handleDeletePhoto(photo.id)}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-red-600 text-white cursor-pointer transition-colors"
                title="Delete Photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-2.5">
              <p className="text-xs font-medium text-gray-800 truncate" title={photo.caption}>
                {photo.caption || 'Untitled photo'}
              </p>
              {photo.photo_date && (
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {photo.photo_date}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {currentAlbumPhotos.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
          <Images className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <h3 className="font-couple text-base font-bold text-gray-700">
            No photographs in this album yet
          </h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Click "Upload Photos to Album" above to add pictures from this ceremony or wedding day event.
          </p>
        </div>
      )}

      {/* Create / Edit Album Modal */}
      {isAlbumModalOpen && editingAlbum && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          style={{ overscrollBehavior: 'contain' }}
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-couple text-xl font-bold text-maroon">
                {editingAlbum.id ? 'Edit Album' : 'Create New Album'}
              </h3>
              <button 
                onClick={() => setIsAlbumModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center justify-between">
                <span>{modalError}</span>
                <button
                  type="button"
                  onClick={() => setModalError(null)}
                  className="text-red-500 hover:text-red-700 ml-2 font-bold"
                >
                  ✕
                </button>
              </div>
            )}

            <form onSubmit={handleSaveAlbum} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Album Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingAlbum.title || ''}
                  onChange={(e) => setEditingAlbum({ ...editingAlbum, title: e.target.value })}
                  placeholder="e.g. Sacred Pheras &amp; Seven Vows"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingAlbum.description || ''}
                  onChange={(e) => setEditingAlbum({ ...editingAlbum, description: e.target.value })}
                  placeholder="A short note about the moments in this album..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="albumPublished"
                    checked={editingAlbum.is_published ?? true}
                    onChange={(e) => setEditingAlbum({ ...editingAlbum, is_published: e.target.checked })}
                    className="rounded border-gray-300 text-maroon focus:ring-gold"
                  />
                  <label htmlFor="albumPublished" className="text-xs text-gray-700 font-medium">
                    Published
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-xs text-gray-500 font-medium">Order:</label>
                  <input
                    type="number"
                    min="1"
                    value={orderInput}
                    onChange={(e) => setOrderInput(e.target.value)}
                    onBlur={() => {
                      const parsed = parseInt(orderInput, 10);
                      if (isNaN(parsed) || parsed < 1) {
                        setOrderInput('1');
                      } else {
                        setOrderInput(parsed.toString());
                      }
                    }}
                    className="w-16 px-2 py-1 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAlbumModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-royal-maroon px-5 py-2 rounded-xl text-xs font-semibold inline-flex items-center space-x-1.5 shadow cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5 text-gold" />
                  <span>Save Album</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
