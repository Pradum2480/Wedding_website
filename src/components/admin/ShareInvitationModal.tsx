import React, { useState, useEffect } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { useNotification } from '../../context/NotificationContext';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  MessageCircle, 
  ExternalLink, 
  QrCode, 
  Sparkles, 
  Heart,
  Smartphone
} from 'lucide-react';

interface ShareInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Official production deployed URL for guests
export const PRODUCTION_PUBLIC_URL = 'https://wedding-website.pradum2480.workers.dev/';

export const ShareInvitationModal: React.FC<ShareInvitationModalProps> = ({ isOpen, onClose }) => {
  const { settings } = useWedding();
  const { showSuccess } = useNotification();
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const publicUrl = PRODUCTION_PUBLIC_URL;

  const formattedDate = settings.wedding_date ? new Date(settings.wedding_date + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }) : 'our auspicious wedding day';

  const coupleNames = (settings.groom_name && settings.bride_name) 
    ? `${settings.groom_name} & ${settings.bride_name}` 
    : 'Our Royal Wedding';

  const venueText = settings.venue_name 
    ? ` at ${settings.venue_name}${settings.city ? ', ' + settings.city : ''}` 
    : '';

  const whatsappMessage = `🌸 *Wedding Invitation* 🌸\n\nYou are cordially invited to celebrate the wedding of *${coupleNames}* on *${formattedDate}*${venueText}.\n\nWe would be delighted to have you celebrate this special occasion with us and shower your warm blessings.\n\n✨ *View our royal wedding invitation & RSVP here:*\n${publicUrl}`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(publicUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = publicUrl;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      showSuccess('Invitation link copied successfully!', 'Link Copied');
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      console.warn('Copy link error:', e);
    }
  };

  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(whatsappMessage);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${coupleNames} | Royal Wedding Invitation`,
          text: `You are cordially invited to our wedding! View our digital royal wedding invitation here:`,
          url: publicUrl
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      handleCopy();
    }
  };

  const hasNativeShare = typeof navigator !== 'undefined' && typeof (navigator as any).share === 'function';

  // QR Code URL via standard SVG endpoint
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&format=svg&color=4A0E1B&bgcolor=FFFDF9&data=${encodeURIComponent(publicUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-[#FFFDF9] rounded-2xl border-2 border-gold/60 shadow-2xl overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-modal-title"
      >
        {/* Header with Dark Maroon Gradient & Gold Accents */}
        <div className="bg-gradient-to-r from-maroon via-maroon-rich to-maroon text-cream px-6 py-5 border-b border-gold/40 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-gold shadow-gold-glow">
                <Share2 className="w-4 h-4" />
              </div>
              <div>
                <h3 id="share-modal-title" className="font-couple text-xl font-bold text-gold">
                  Share Your Wedding Invitation
                </h3>
                <p className="text-[11px] font-heading text-cream/70 tracking-wide">
                  Share this invitation directly with family, friends &amp; guests
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-cream/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">

          {/* Couple Banner */}
          <div className="p-3.5 rounded-xl bg-cream/70 border border-gold/30 flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0">
              <Heart className="w-4 h-4 fill-maroon text-maroon flex-shrink-0" />
              <span className="font-couple text-base font-bold text-maroon truncate">
                {coupleNames}
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-wider font-heading px-2 py-0.5 rounded-full bg-gold/20 text-gold-deep font-bold flex-shrink-0">
              Live Invitation
            </span>
          </div>

          {/* Public Invitation URL Box */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 font-heading">
              Public Invitation URL:
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={publicUrl}
                onClick={(e) => (e.target as HTMLInputElement).select()}
                className="flex-1 px-3.5 py-2.5 text-xs font-mono bg-white rounded-xl border border-gold/40 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gold/50 shadow-inner select-all"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="btn-royal-gold px-4 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center space-x-1.5 shadow-sm cursor-pointer hover:scale-102 active:scale-98 transition-all flex-shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-700" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-dark-text" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Action Sharing Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* WhatsApp Sharing */}
            <button
              type="button"
              onClick={handleWhatsApp}
              className="w-full px-4 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-heading font-bold text-xs inline-flex items-center justify-center space-x-2 shadow transition-all hover:scale-102 active:scale-98 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Share on WhatsApp</span>
            </button>

            {/* Native Share or Direct Link */}
            {hasNativeShare ? (
              <button
                type="button"
                onClick={handleNativeShare}
                className="w-full px-4 py-3 rounded-xl bg-maroon hover:bg-maroon-rich text-gold font-heading font-bold text-xs inline-flex items-center justify-center space-x-2 border border-gold/50 shadow transition-all hover:scale-102 active:scale-98 cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-gold" />
                <span>More Sharing Options</span>
              </button>
            ) : (
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-4 py-3 rounded-xl bg-maroon hover:bg-maroon-rich text-gold font-heading font-bold text-xs inline-flex items-center justify-center space-x-2 border border-gold/50 shadow transition-all hover:scale-102 active:scale-98"
              >
                <ExternalLink className="w-4 h-4 text-gold" />
                <span>Open Public Website</span>
              </a>
            )}
          </div>

          {/* QR Code Collapsible Section */}
          <div className="pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setShowQR(prev => !prev)}
              className="w-full py-2 text-xs font-heading font-semibold text-maroon hover:text-gold-deep inline-flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-gold-deep" />
              <span>{showQR ? 'Hide Invitation QR Code' : 'Show Invitation QR Code for Guests'}</span>
            </button>

            {showQR && (
              <div className="mt-3 p-4 rounded-xl bg-white border border-gold/30 shadow-inner flex flex-col items-center justify-center text-center space-y-2 animate-fade-in">
                <div className="p-3 bg-[#FFFDF9] rounded-xl border-2 border-gold/40 shadow-sm">
                  <img
                    src={qrCodeUrl}
                    alt="Wedding Invitation QR Code"
                    className="w-44 h-44 object-contain"
                    loading="lazy"
                  />
                </div>
                <p className="text-[11px] font-heading text-gray-600">
                  Guests can scan this QR code with their mobile cameras to view the invitation instantly.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="bg-cream/50 px-6 py-3.5 border-t border-gold/20 flex items-center justify-between text-xs">
          <span className="text-[11px] font-heading text-gray-500">
            Deployed on Cloudflare Workers
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold cursor-pointer text-xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

