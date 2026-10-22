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
import { Footer } from '../components/public/Footer';

export const PublicWebsite: React.FC = () => {
  const { hasOpenedInvitation, setHasOpenedInvitation } = useWedding();
  const [showCover, setShowCover] = useState(!hasOpenedInvitation);

  const handleOpenInvitation = () => {
    setShowCover(false);
    setHasOpenedInvitation(true);
  };

  const handleReplayCover = () => {
    setShowCover(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-ivory text-dark-text selection:bg-gold-light selection:text-maroon">
      
      {/* Animated Invitation Cover */}
      {showCover && (
        <InvitationCover onOpen={handleOpenInvitation} />
      )}

      {/* Floating Audio Player */}
      <BackgroundMusicPlayer />

      {/* Main Wedding Content */}
      <main className="relative">
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
