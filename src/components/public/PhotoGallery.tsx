import React, { useState, useEffect, useCallback } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { RoyalDivider } from '../common/RoyalDivider';
import { TiltCard } from '../common/TiltCard';
import { RevealOnScroll } from '../common/RevealOnScroll';
import { WeddingPhoto } from '../../types/wedding';
import { X, ChevronLeft, ChevronRight, Maximize2, Sparkles } from 'lucide-react';

export const PhotoGallery: React.FC = () => {
  const { photos, websiteSettings } = useWedding();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  if (!websiteSettings.show_main_gallery) return null;

  const publishedPhotos = photos.filter(p => p.is_published && p.category !== 'after_wedding');

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
    <section id="gallery" className="py-20 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <RevealOnScroll variant="fade-up">
          <div className="text-center mb-12">
            <p className="font-heading uppercase tracking-[0.25em] text-xs font-bold text-gold-deep mb-2">
              Moments of Love &amp; Togetherness
            </p>
            <h2 className="font-couple text-3xl sm:text-5xl text-maroon font-bold">
              Couple's Gallery
            </h2>
            <p className="font-heading text-sm sm:text-base text-dark-muted max-w-lg mx-auto mt-2">
              A celebration of our cherished moments, heartfelt smiles, and eternal bond.
            </p>
            <RoyalDivider />
          </div>
        </RevealOnScroll>

        {/* Responsive Gallery Grid with 3D Tilt & Light Flare */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {publishedPhotos.map((photo, idx) => (
            <RevealOnScroll 
              key={photo.id}
              variant="fade-up"
              delayMs={(idx % 6) * 100}
            >
              <TiltCard maxTilt={5}>
                <div
                  onClick={() => openLightbox(idx)}
                  className="royal-card corner-flourish rounded-xl overflow-hidden cursor-pointer group relative aspect-square sm:aspect-[4/3] bg-cream shadow-sm hover:shadow-gold-glow-lg transition-all border-2 border-gold/30 hover:border-gold"
                >
                  <img
                    src={photo.photo_url}
                    alt={photo.alt_text || photo.caption || 'Wedding Photo'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-text/90 via-dark-text/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                    {photo.caption && (
                      <p className="font-heading text-sm text-gold-light italic line-clamp-2 drop-shadow">
                        "{photo.caption}"
                      </p>
                    )}
                    <div className="flex items-center space-x-1.5 text-gold text-xs font-bold mt-2">
                      <Maximize2 className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" />
                      <span>Click to view full screen</span>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </RevealOnScroll>
          ))}
        </div>

      </div>

      {/* Lightbox Modal with Smooth Scale Animation */}
      {currentPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300 animate-fadeIn"
          style={{ overscrollBehavior: 'contain' }}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border border-white/20 hover:scale-110 active:scale-95"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev button */}
          <button
            onClick={(e) => { e.stopPropagation(); showPrev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer border border-white/20 hover:scale-110 active:scale-95"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next button */}
          <button
            onClick={(e) => { e.stopPropagation(); showNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer border border-white/20 hover:scale-110 active:scale-95"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Main Photo Display with entrance zoom */}
          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center text-center animate-reveal-scale">
            <img
              src={currentPhoto.photo_url}
              alt={currentPhoto.alt_text || currentPhoto.caption || 'Full view'}
              className="max-h-[70vh] max-w-full object-contain rounded-lg border-2 border-gold/50 shadow-gold-glow-lg"
            />
            {currentPhoto.caption && (
              <p className="font-heading text-lg text-cream mt-4 italic max-w-xl">
                "{currentPhoto.caption}"
              </p>
            )}
            <p className="text-xs text-gold font-heading mt-2 font-bold tracking-wider">
              {selectedPhotoIndex! + 1} of {publishedPhotos.length}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
