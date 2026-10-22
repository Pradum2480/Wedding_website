import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { RoyalDivider } from '../common/RoyalDivider';
import { Share2, Copy, Check, MessageCircle, Send } from 'lucide-react';

export const WhatsAppShare: React.FC = () => {
  const { settings } = useWedding();
  const [copied, setCopied] = useState(false);

  const formattedDate = settings.wedding_date ? new Date(settings.wedding_date + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }) : 'our auspicious wedding day';

  const currentUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : 'https://wedding.royal';

  // Construct message
  const shareMessage = `🌸 *Wedding Invitation* 🌸\n\nYou are cordially invited to celebrate the wedding of *${settings.groom_name}* & *${settings.bride_name}* on *${formattedDate}* at *${settings.venue_name}, ${settings.city}*.\n\nWe would love to celebrate this joyous milestone with you and receive your warm blessings.\n\n✨ View our complete royal invitation, countdown & RSVP:\n${currentUrl}`;

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(shareMessage);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(currentUrl);
      } else {
        const input = document.createElement('input');
        input.value = currentUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      console.warn('Copy link error:', e);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${settings.groom_name} & ${settings.bride_name} | Royal Wedding Invitation`,
          text: `You are cordially invited to celebrate the royal wedding of ${settings.groom_name} & ${settings.bride_name} on ${formattedDate}.`,
          url: currentUrl
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <section id="share" className="py-16 px-4 relative z-10 bg-cream-pattern">
      <div className="max-w-xl mx-auto text-center">
        
        <p className="font-heading uppercase tracking-[0.25em] text-xs font-semibold text-gold-deep mb-2">
          Spread the Joy
        </p>
        <h2 className="font-couple text-2xl sm:text-3xl text-maroon font-bold mb-2">
          Share Our Invitation
        </h2>
        <p className="font-heading text-sm text-dark-muted max-w-sm mx-auto mb-6">
          Forward this digital card to your loved ones on WhatsApp or copy the personal link.
        </p>

        <div className="royal-card rounded-2xl p-6 sm:p-8 border border-gold/40 bg-[#FFFDF9] shadow-sm">
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            
            {/* WhatsApp Share Button */}
            <button
              onClick={handleWhatsAppShare}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#25D366] text-white hover:bg-[#20ba59] font-heading font-semibold text-xs sm:text-sm inline-flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Share on WhatsApp</span>
            </button>

            {/* Native Web Share API if supported */}
            {typeof navigator !== 'undefined' && typeof (navigator as any).share === 'function' && (
              <button
                onClick={handleNativeShare}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-maroon text-gold hover:bg-maroon-rich font-heading font-semibold text-xs sm:text-sm inline-flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer border border-gold/40"
              >
                <Share2 className="w-4 h-4 text-gold" />
                <span>Share Invitation</span>
              </button>
            )}

            {/* Copy Link Button */}
            <button
              onClick={handleCopyLink}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-white text-dark-text border border-gold/40 hover:bg-cream font-heading font-semibold text-xs sm:text-sm inline-flex items-center justify-center space-x-2 transition-all shadow-sm cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-green-700 font-bold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-gold-deep" />
                  <span>Copy Link</span>
                </>
              )}
            </button>

          </div>

          {copied && (
            <p className="text-xs text-green-700 font-heading font-semibold mt-3 animate-fade-in">
              Invitation link copied to clipboard! You can paste and send it anywhere.
            </p>
          )}

        </div>

      </div>
    </section>
  );
};
