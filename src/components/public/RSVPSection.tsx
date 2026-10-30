import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { RoyalDivider } from '../common/RoyalDivider';
import { TiltCard } from '../common/TiltCard';
import { RevealOnScroll } from '../common/RevealOnScroll';
import { submitRSVP } from '../../services/weddingService';
import confetti from 'canvas-confetti';
import { CheckCircle2, Send, Heart, Users, Phone, MessageSquare, AlertCircle, Sparkles } from 'lucide-react';

export const RSVPSection: React.FC = () => {
  const { websiteSettings, settings } = useWedding();
  const [guestName, setGuestName] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState<'attending' | 'declined'>('attending');
  const [attendeesCount, setAttendeesCount] = useState<number>(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!websiteSettings.show_rsvp_section) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!guestName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitRSVP({
        guest_name: guestName.trim(),
        attendance_status: attendanceStatus,
        attendees_count: attendanceStatus === 'attending' ? Number(attendeesCount) : 0,
        phone_number: phoneNumber.trim() || undefined,
        message: message.trim() || undefined,
      });

      if (res.success) {
        setSubmitted(true);
        if (attendanceStatus === 'attending') {
          // Double celebratory royal confetti cannons!
          confetti({
            particleCount: 110,
            spread: 90,
            origin: { y: 0.65, x: 0.35 },
            colors: ['#D4AF37', '#FFDF73', '#6D1427', '#FFF8E7', '#B8860B'],
          });
          confetti({
            particleCount: 110,
            spread: 90,
            origin: { y: 0.65, x: 0.65 },
            colors: ['#D4AF37', '#FFDF73', '#6D1427', '#FFF8E7', '#B8860B'],
          });
        }
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="py-20 px-4 relative z-10">
      <div className="max-w-2xl mx-auto">
        
        {/* Section Header */}
        <RevealOnScroll variant="fade-up">
          <div className="text-center mb-10">
            <p className="font-heading uppercase tracking-[0.25em] text-xs font-bold text-gold-deep mb-2">
              Will You Honor Us With Your Presence?
            </p>
            <h2 className="font-couple text-3xl sm:text-5xl text-maroon font-bold">
              Kindly RSVP
            </h2>
            <p className="font-heading text-sm sm:text-base text-dark-muted max-w-md mx-auto mt-2">
              Please let us know if you will be celebrating with us by filling in your response below.
            </p>
            <RoyalDivider />
          </div>
        </RevealOnScroll>

        {/* Form Container with 3D Tilt */}
        <RevealOnScroll variant="scale-up" delayMs={150}>
          <TiltCard maxTilt={4}>
            <div className="royal-card corner-flourish rounded-2xl p-6 sm:p-10 border-2 border-gold/50 bg-[#FFFDF9] shadow-card-luxury relative">
              
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-gold/15 border-2 border-gold flex items-center justify-center mx-auto mb-4 text-maroon animate-bounce">
                    <CheckCircle2 className="w-8 h-8 text-maroon" />
                  </div>
                  <h3 className="font-couple text-2xl sm:text-3xl font-bold text-maroon mb-2 break-words">
                    Thank You, {guestName}!
                  </h3>
                  <p className="font-heading text-base text-dark-text max-w-md mx-auto mb-4">
                    {attendanceStatus === 'attending' 
                      ? 'We are overjoyed that you will be joining our wedding festivities! We look forward to celebrating together.'
                      : 'We will truly miss having you by our side, but we carry your warm blessings in our hearts.'}
                  </p>
                  <div className="p-4 rounded-xl bg-cream/70 border border-gold/30 text-xs text-dark-muted">
                    Your response has been securely saved to the wedding registry.
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Guest Name */}
                  <div>
                    <label className="block text-xs font-heading uppercase tracking-wider font-bold text-maroon mb-1.5">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="e.g. Mr. Rajesh &amp; Family"
                      className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-white focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold text-sm font-heading transition-all"
                    />
                  </div>

                  {/* Attendance Options */}
                  <div>
                    <label className="block text-xs font-heading uppercase tracking-wider font-bold text-maroon mb-2">
                      Will You Be Attending? <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setAttendanceStatus('attending')}
                        className={`py-3 px-4 rounded-xl border text-xs sm:text-sm font-heading font-bold transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                          attendanceStatus === 'attending'
                            ? 'bg-maroon text-gold border-2 border-gold shadow-gold-glow scale-[1.02]'
                            : 'bg-white text-dark-text border-gold/30 hover:bg-cream'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4 text-gold" />
                        <span>Joyfully Accept</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAttendanceStatus('declined')}
                        className={`py-3 px-4 rounded-xl border text-xs sm:text-sm font-heading font-bold transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                          attendanceStatus === 'declined'
                            ? 'bg-maroon text-gold border-2 border-gold shadow-gold-glow scale-[1.02]'
                            : 'bg-white text-dark-text border-gold/30 hover:bg-cream'
                        }`}
                      >
                        <Heart className="w-4 h-4 text-gold/80" />
                        <span>Regretfully Decline</span>
                      </button>
                    </div>
                  </div>

                  {/* Attendees Count */}
                  {attendanceStatus === 'attending' && (
                    <div>
                      <label className="block text-xs font-heading uppercase tracking-wider font-bold text-maroon mb-1.5 flex items-center justify-between">
                        <span>Number of Guests Attending</span>
                        <span className="text-[11px] text-dark-muted font-normal">
                          Max {websiteSettings.max_rsvp_attendees || 10}
                        </span>
                      </label>
                      <div className="relative">
                        <select
                          value={attendeesCount}
                          onChange={(e) => setAttendeesCount(Number(e.target.value))}
                          className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-white focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold text-sm font-heading appearance-none transition-all"
                        >
                          {Array.from({ length: websiteSettings.max_rsvp_attendees || 10 }, (_, i) => i + 1).map((n) => (
                            <option key={n} value={n}>
                              {n} {n === 1 ? 'Guest' : 'Guests'}
                            </option>
                          ))}
                        </select>
                        <Users className="w-4 h-4 text-gold-deep absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  )}

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-heading uppercase tracking-wider font-bold text-maroon mb-1.5">
                      Phone / WhatsApp Number <span className="text-dark-muted font-normal text-[11px]">(Optional)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-3 pl-10 rounded-xl border border-gold/40 bg-white focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold text-sm font-heading transition-all"
                      />
                      <Phone className="w-4 h-4 text-gold-deep absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Blessings */}
                  <div>
                    <label className="block text-xs font-heading uppercase tracking-wider font-bold text-maroon mb-1.5">
                      Blessings &amp; Message for the Couple <span className="text-dark-muted font-normal text-[11px]">(Optional)</span>
                    </label>
                    <div className="relative">
                      <textarea
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Write your heartfelt wishes, blessings, or notes here..."
                        className="w-full px-4 py-3 pl-10 rounded-xl border border-gold/40 bg-white focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold text-sm font-heading resize-none transition-all"
                      />
                      <MessageSquare className="w-4 h-4 text-gold-deep absolute left-3.5 top-3.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-royal-maroon w-full py-4 rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md hover:scale-[1.01] active:scale-99 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 text-gold" />
                    <span>{isSubmitting ? 'Recording Response...' : 'Send RSVP Response'}</span>
                    <Sparkles className="w-4 h-4 text-gold-light" />
                  </button>

                  <p className="text-[11px] text-center text-dark-muted">
                    Your contact details are kept strictly private and will never be shared publicly.
                  </p>

                </form>
              )}

            </div>
          </TiltCard>
        </RevealOnScroll>

      </div>
    </section>
  );
};
