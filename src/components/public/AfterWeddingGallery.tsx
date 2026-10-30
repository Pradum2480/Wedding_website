import React, { useState, useEffect, useCallback } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { RoyalDivider } from '../common/RoyalDivider';
import { TiltCard } from '../common/TiltCard';
import { RevealOnScroll } from '../common/RevealOnScroll';
import { WeddingAlbum, WeddingPhoto } from '../../types/wedding';
import { FolderHeart, Calendar, Maximize2, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

export const AfterWeddingGallery: React.FC = () => {
  const { albums, photos, websiteSettings } = useWedding();
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>('');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const publishedAlbums = albums.filter(a => a.is_published);

  useEffect(() => {
    if (publishedAlbums.length > 0 && !selectedAlbumId) {
      setSelectedAlbumId(publishedAlbums[0].id);
    }
  }, [publishedAlbums, selectedAlbumId]);

  if (!websiteSettings.show_after_wedding_gallery || publishedAlbums.length === 0) {
    return null;
  }

  const currentAlbumPhotos = photos.filter(p => 
    p.is_published && 
    p.category === 'after_wedding' && 
    (selectedAlbumId ? p.album_id === selectedAlbumId : true)
  );

  const currentAlbum = publishedAlbums.find(a => a.id === selectedAlbumId);

  const openLightbox = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const closeLightbox = () => {
    setSelectedPhotoIndex(null);
  };

  const showNext = useCallback(() => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex + 1) % currentAlbumPhotos.length);
  }, [selectedPhotoIndex, currentAlbumPhotos.length]);

  const showPrev = useCallback(() => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex - 1 + currentAlbumPhotos.length) % currentAlbumPhotos.length);
  }, [selectedPhotoIndex, currentAlbumPhotos.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex, showNext, showPrev]);

  const currentPhoto: WeddingPhoto | null = selectedPhotoIndex !== null ? currentAlbumPhotos[selectedPhotoIndex] : null;

  return (
    <section id="after-wedding" className="py-20 px-4 relative z-10 bg-[#FFFDF9]">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <RevealOnScroll variant="fade-up">
          <div className="text-center mb-8">
            <p className="font-heading uppercase tracking-[0.25em] text-xs font-bold text-gold-deep mb-2">
              Cherished Eternal Keepsakes
            </p>
            <h2 className="font-couple text-3xl sm:text-5xl text-maroon font-bold">
              Our Wedding Memories
            </h2>
            <p className="font-heading text-sm sm:text-base text-dark-muted max-w-lg mx-auto mt-2">
              The joy, smiles, hugs, tears, and dancing from our special day — lovingly preserved for a lifetime.
            </p>
            <RoyalDivider />
          </div>
        </RevealOnScroll>

        {/* Album Selector Tabs */}
        <RevealOnScroll variant="fade-up" delayMs={100}>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
            {publishedAlbums.map(album => (
              <button
                key={album.id}
                onClick={() => setSelectedAlbumId(album.id)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-heading font-bold transition-all inline-flex items-center space-x-2 cursor-pointer ${
                  selectedAlbumId === album.id
                    ? 'bg-maroon text-gold border-2 border-gold shadow-gold-glow scale-105'
                    : 'bg-white text-dark-text border border-gold/30 hover:border-gold hover:bg-cream'
                }`}
              >
                <FolderHeart className="w-3.5 h-3.5" />
                <span>{album.title}</span>
              </button>
            ))}
          </div>
        </RevealOnScroll>

        {/* Selected Album Description */}
        {currentAlbum && currentAlbum.description && (
          <div className="text-center mb-8 max-w-2xl mx-auto">
            <p className="font-heading text-sm text-dark-muted italic">
              "{currentAlbum.description}"
            </p>
          </div>
        )}

        {/* Photo Grid with Tilt & Reveal */}
        {currentAlbumPhotos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {currentAlbumPhotos.map((photo, idx) => (
              <RevealOnScroll
                key={photo.id}
                variant="fade-up"
                delayMs={(idx % 8) * 80}
              >
                <TiltCard maxTilt={5}>
                  <div
                    onClick={() => openLightbox(idx)}
                    className="royal-card corner-flourish rounded-xl overflow-hidden cursor-pointer group relative aspect-square bg-cream shadow-sm hover:shadow-gold-glow transition-all border-2 border-gold/30 hover:border-gold"
                  >
                    <img
                      src={photo.photo_url}
                      alt={photo.caption || 'Wedding Memory'}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-text/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3.5">
                      {photo.caption && (
                        <p className="font-heading text-xs text-cream font-medium line-clamp-2">
                          {photo.caption}
                        </p>
                      )}
                      {photo.photo_date && (
                        <p className="text-[10px] text-gold-light mt-1 flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{photo.photo_date}</span>
                        </p>
                      )}
                      <div className="flex items-center space-x-1 text-gold text-[11px] font-bold mt-1">
                        <Maximize2 className="w-3 h-3" />
                        <span>View Photo</span>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </RevealOnScroll>
            ))}
          </div>
        ) : (
          <div className="royal-card rounded-xl p-10 text-center max-w-md mx-auto border border-dashed border-gold/40">
            <ImageIcon className="w-10 h-10 text-gold-deep mx-auto mb-3 opacity-60" />
            <h4 className="font-couple text-lg font-bold text-maroon mb-1">
              Photographs Coming Soon
            </h4>
            <p className="font-heading text-xs text-dark-muted">
              Photographs from this ceremony will be uploaded here following the wedding celebration.
            </p>
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      {currentPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300"
          style={{ overscrollBehavior: 'contain' }}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border border-white/20 hover:scale-110 active:scale-95"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); showPrev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer border border-white/20 hover:scale-110 active:scale-95"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); showNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer border border-white/20 hover:scale-110 active:scale-95"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center text-center">
            <img
              src={currentPhoto.photo_url}
              alt={currentPhoto.caption || 'Full view'}
              className="max-h-[70vh] max-w-full object-contain rounded-lg border-2 border-gold/50 shadow-gold-glow-lg"
            />
            {currentPhoto.caption && (
              <p className="font-heading text-lg text-cream mt-4 italic max-w-xl">
                "{currentPhoto.caption}"
              </p>
            )}
            <p className="text-xs text-gold font-heading mt-2 font-bold tracking-wider">
              {selectedPhotoIndex! + 1} of {currentAlbumPhotos.length}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
