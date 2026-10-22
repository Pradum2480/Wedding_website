import React, { useState, useEffect, useCallback } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { RoyalDivider } from '../common/RoyalDivider';
import { WeddingPhoto } from '../../types/wedding';
import { X, ChevronLeft, ChevronRight, Maximize2, Sparkles } from 'lucide-react';

export const PhotoGallery: React.FC = () => {
  const { photos, websiteSettings } = useWedding();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'couple' | 'gallery'>('all');

  if (!websiteSettings.show_main_gallery) return null;

  const publishedPhotos = photos.filter(p => {
    if (!p.is_published) return false;
    if (p.category === 'after_wedding') return false; // after wedding has its own dedicated section
    if (activeTab === 'couple') return p.category === 'couple';
    if (activeTab === 'gallery') return p.category === 'gallery';
    return true;
  });

  const openLightbox = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const closeLightbox = () => {
    setSelectedPhotoIndex(null);
  };

  const showNext = useCallback(() => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex + 1) % publishedPhotos.length);
  }, [selectedPhotoIndex, publishedPhotos.length]);

  const showPrev = useCallback(() => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex - 1 + publishedPhotos.length) % publishedPhotos.length);
  }, [selectedPhotoIndex, publishedPhotos.length]);

  // Keyboard navigation
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

  if (publishedPhotos.length === 0) return null;

  const currentPhoto: WeddingPhoto | null = selectedPhotoIndex !== null ? publishedPhotos[selectedPhotoIndex] : null;

  return (
    <section id="gallery" className="py-16 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-8">
          <p className="font-heading uppercase tracking-[0.25em] text-xs font-semibold text-gold-deep mb-2">
            Moments of Splendor
          </p>
          <h2 className="font-couple text-3xl sm:text-4xl text-maroon font-bold">
            Pre-Wedding Gallery
          </h2>
          <p className="font-heading text-sm sm:text-base text-dark-muted max-w-lg mx-auto mt-2">
            A glimpse into our journey of love, stolen glances, and cherished vows.
          </p>
          <RoyalDivider />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-10">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-heading font-semibold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-maroon text-gold border border-gold shadow-md'
                : 'bg-white/80 text-dark-text border border-gold/30 hover:border-gold'
            }`}
          >
            All Moments
          </button>
          <button
            onClick={() => setActiveTab('couple')}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-heading font-semibold transition-all cursor-pointer ${
              activeTab === 'couple'
                ? 'bg-maroon text-gold border border-gold shadow-md'
                : 'bg-white/80 text-dark-text border border-gold/30 hover:border-gold'
            }`}
          >
            Royal Portraits
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-heading font-semibold transition-all cursor-pointer ${
              activeTab === 'gallery'
                ? 'bg-maroon text-gold border border-gold shadow-md'
                : 'bg-white/80 text-dark-text border border-gold/30 hover:border-gold'
            }`}
          >
            Pre-Wedding Tales
          </button>
        </div>

        {/* Responsive Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {publishedPhotos.map((photo, idx) => (
            <div
              key={photo.id}
              onClick={() => openLightbox(idx)}
              className="royal-card corner-flourish rounded-xl overflow-hidden cursor-pointer group relative aspect-square sm:aspect-[4/3] bg-cream shadow-sm hover:shadow-gold-glow transition-all"
            >
              <img
                src={photo.photo_url}
                alt={photo.alt_text || photo.caption || 'Wedding Photo'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-text/80 via-dark-text/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                {photo.caption && (
                  <p className="font-heading text-sm text-gold-light italic line-clamp-2">
                    "{photo.caption}"
                  </p>
                )}
                <div className="flex items-center space-x-1 text-gold text-xs font-semibold mt-2">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Click to view full screen</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {currentPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 transition-all"
          style={{ overscrollBehavior: 'contain' }}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border border-white/20"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev button */}
          <button
            onClick={(e) => { e.stopPropagation(); showPrev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer border border-white/20"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next button */}
          <button
            onClick={(e) => { e.stopPropagation(); showNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer border border-white/20"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Main Photo Display */}
          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center text-center">
            <img
              src={currentPhoto.photo_url}
              alt={currentPhoto.alt_text || currentPhoto.caption || 'Full view'}
              className="max-h-[70vh] max-w-full object-contain rounded-lg border border-gold/40 shadow-2xl"
            />
            {currentPhoto.caption && (
              <p className="font-heading text-lg text-cream mt-4 italic max-w-xl">
                "{currentPhoto.caption}"
              </p>
            )}
            <p className="text-xs text-gold/80 font-heading mt-2">
              {selectedPhotoIndex! + 1} of {publishedPhotos.length}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
