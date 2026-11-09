import React, { useState } from 'react';
import { useWedding } from '../context/WeddingContext';
import { InvitationCover } from '../components/public/InvitationCover';
import { HeroSection } from '../components/public/HeroSection';
import { CountdownTimer } from '../components/public/CountdownTimer';
import { CoupleSection } from '../components/public/CoupleSection';
import { EventsTimeline } from '../components/public/EventsTimeline';
import { PhotoGallery } from '../components/public/PhotoGallery';
import { AfterWeddingGallery } from '../components/public/AfterWeddingGallery';
import { RSVPSection } from '../components/public/RSVPSection';
import { VenueMapSection } from '../components/public/VenueMapSection';
import { WhatsAppShare } from '../components/public/WhatsAppShare';
import { BackgroundMusicPlayer } from '../components/public/BackgroundMusicPlayer';
import { FloatingPetals } from '../components/common/FloatingPetals';
import { RoyalScrollProgress } from '../components/common/RoyalScrollProgress';
import { ScrollParallaxDecorations } from '../components/common/ScrollParallaxDecorations';
import { Footer } from '../components/public/Footer';
import { Sparkles, AlertCircle, RotateCcw } from 'lucide-react';

export const PublicWebsite: React.FC = () => {
  const { hasOpenedInvitation, setHasOpenedInvitation, isLoading, fetchError, refreshData, settings } = useWedding();
  const [showCover, setShowCover] = useState(!hasOpenedInvitation);

  const handleOpenInvitation = () => {
    setShowCover(false);
    setHasOpenedInvitation(true);
  };

  const handleReplayCover = () => {
    setShowCover(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. Royal Loading Screen (Prevents rendering outdated hardcoded data while loading fresh database data)
  if (isLoading && !settings.groom_name) {
    return (
      <div 
        className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-cream select-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, #4A0E1B 0%, #2B060F 60%, #170207 100%)',
        }}
      >
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-full border-2 border-gold/30 flex items-center justify-center animate-spin-slow">
            <div className="w-16 h-16 rounded-full border-t-2 border-b-2 border-gold" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-gold animate-pulse" />
          </div>
        </div>
        <div className="text-center max-w-sm space-y-1.5">
          <p className="font-heading uppercase tracking-[0.3em] text-[10px] sm:text-xs font-bold text-gold-light">
            Royal Wedding Invitation
          </p>
          <p className="font-couple text-xl sm:text-2xl font-bold text-gold">
            Opening Auspicious Invitation...
          </p>
        </div>
      </div>
    );
  }

  // 2. Royal Error State (Gracefully guides user to retry without falling back to unrelated names)
  if (fetchError && !settings.groom_name) {
    return (
      <div 
        className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-cream select-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, #4A0E1B 0%, #2B060F 60%, #170207 100%)',
        }}
      >
        <div className="max-w-md w-full royal-card rounded-2xl p-7 border-2 border-gold/40 bg-[#FFFDF9] text-dark-text text-center shadow-gold-glow-lg space-y-4">
          <div className="w-14 h-14 rounded-full bg-maroon/10 border border-maroon/20 flex items-center justify-center mx-auto text-maroon">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="font-couple text-2xl font-bold text-maroon">
            Unable to Load Invitation
          </h2>
          <p className="font-heading text-xs sm:text-sm text-dark-muted leading-relaxed">
            We could not retrieve the wedding details at this moment. Please check your internet connection.
          </p>
          <button
            onClick={() => refreshData()}
            className="btn-royal-gold px-6 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center space-x-2 shadow cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-dark-text" />
            <span>Retry Loading</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-ivory text-dark-text selection:bg-gold-light selection:text-maroon overflow-x-hidden">
      
      {/* 24K Royal Gold Scroll Progress Thread across the top */}
      <RoyalScrollProgress />

      {/* Multilayer Scroll Parallax Ambient Ornaments */}
      <ScrollParallaxDecorations />

      {/* 3D Wax Seal Unfolding Invitation Cover */}
      {showCover && (
        <InvitationCover onOpen={handleOpenInvitation} />
      )}

      {/* Floating Rose Petals & Golden Stardust Particle Engine */}
      <FloatingPetals />

      {/* Floating Vinyl Audio Player with Dancing Equalizer */}
      <BackgroundMusicPlayer />

      {/* Main Wedding Content */}
      <main className="relative z-10">
        <HeroSection onReplayCover={handleReplayCover} />
        <CountdownTimer />
        <CoupleSection />
        <EventsTimeline />
        <PhotoGallery />
        <AfterWeddingGallery />
        <RSVPSection />
        <VenueMapSection />
        <WhatsAppShare />
      </main>

      {/* Footer */}
      <Footer onReplayCover={handleReplayCover} />

    </div>
  );
};
