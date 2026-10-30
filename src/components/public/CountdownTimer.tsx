import React, { useState, useEffect } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { RoyalDivider } from '../common/RoyalDivider';
import { TiltCard } from '../common/TiltCard';
import { RevealOnScroll } from '../common/RevealOnScroll';
import { Clock, Heart, Calendar, Sparkles } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPassed: boolean;
}

export const CountdownTimer: React.FC = () => {
  const { settings } = useWedding();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPassed: false,
  });

  useEffect(() => {
    if (!settings.wedding_date) return;

    const calculateTimeLeft = (): TimeLeft => {
      try {
        const dateStr = settings.wedding_date;
        const timeStr = settings.wedding_start_time || '18:30';
        const targetDate = new Date(`${dateStr}T${timeStr}:00`);
        const now = new Date();
        const difference = targetDate.getTime() - now.getTime();

        if (difference <= 0) {
          return { days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true };
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        return { days, hours, minutes, seconds, isPassed: false };
      } catch (e) {
        console.warn('Countdown calculation error:', e);
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: false };
      }
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [settings.wedding_date, settings.wedding_start_time, settings.time_zone]);

  return (
    <section id="countdown" className="py-14 px-4 relative z-10">
      <div className="max-w-4xl mx-auto text-center">
        
        <RevealOnScroll variant="scale-up" durationMs={900}>
          {timeLeft.isPassed ? (
            <TiltCard maxTilt={5}>
              <div className="royal-card rounded-2xl p-8 sm:p-12 border-2 border-gold shadow-gold-glow-lg bg-[#FFFDF9]">
                <Heart className="w-12 h-12 text-maroon mx-auto mb-4 animate-bounce fill-maroon" />
                <h2 className="font-couple text-3xl sm:text-5xl text-maroon font-bold mb-3">
                  Our Forever Begins
                </h2>
                <p className="font-heading text-lg sm:text-xl text-dark-text max-w-xl mx-auto italic">
                  Thank you for being part of our special celebration and blessing our union with endless love.
                </p>
                <RoyalDivider />
                <p className="font-script text-2xl text-gold-deep">
                  With infinite gratitude &bull; {settings.groom_name} &amp; {settings.bride_name}
                </p>
              </div>
            </TiltCard>
          ) : (
            <TiltCard maxTilt={6}>
              <div className="royal-card corner-flourish rounded-2xl p-6 sm:p-10 border-2 border-gold/50 bg-gradient-to-b from-[#FFFDF9] via-[#FFFBF0] to-[#FFF8E7] shadow-card-luxury relative overflow-hidden">
                
                {/* Background Ambient Radial Sheen */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center justify-center space-x-2 text-gold-deep mb-2">
                  <Clock className="w-4 h-4 animate-pulse" />
                  <span className="font-heading uppercase tracking-[0.25em] text-xs font-bold">
                    Countdown to the Auspicious Hour
                  </span>
                  <Clock className="w-4 h-4 animate-pulse" />
                </div>

                <h2 className="font-couple text-2xl sm:text-4xl text-maroon font-bold mb-2">
                  The Royal Celebration Awaits
                </h2>

                <p className="font-heading text-sm sm:text-base text-dark-muted mb-8 max-w-lg mx-auto">
                  Counting down every cherished second until we take our sacred vows.
                </p>

                {/* Horological Metallic Countdown Cards */}
                <div className="grid grid-cols-4 gap-2 sm:gap-6 max-w-2xl mx-auto">
                  
                  {/* Days */}
                  <div className="digit-card border-2 border-gold/40 rounded-xl p-2 sm:p-5 shadow-md hover:border-gold transition-colors group min-w-0">
                    <span className="font-couple text-2xl sm:text-5xl font-bold text-maroon block leading-none drop-shadow-sm group-hover:scale-105 transition-transform">
                      {String(timeLeft.days).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] sm:text-xs font-heading font-bold text-gold-deep uppercase tracking-wider mt-2 block truncate">
                      Days
                    </span>
                  </div>

                  {/* Hours */}
                  <div className="digit-card border-2 border-gold/40 rounded-xl p-2 sm:p-5 shadow-md hover:border-gold transition-colors group min-w-0">
                    <span className="font-couple text-2xl sm:text-5xl font-bold text-maroon block leading-none drop-shadow-sm group-hover:scale-105 transition-transform">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] sm:text-xs font-heading font-bold text-gold-deep uppercase tracking-wider mt-2 block truncate">
                      Hours
                    </span>
                  </div>

                  {/* Minutes */}
                  <div className="digit-card border-2 border-gold/40 rounded-xl p-2 sm:p-5 shadow-md hover:border-gold transition-colors group min-w-0">
                    <span className="font-couple text-2xl sm:text-5xl font-bold text-maroon block leading-none drop-shadow-sm group-hover:scale-105 transition-transform">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] sm:text-xs font-heading font-bold text-gold-deep uppercase tracking-wider mt-2 block truncate">
                      Minutes
                    </span>
                  </div>

                  {/* Seconds with Active Heartbeat Ring */}
                  <div className="digit-card border-2 border-gold rounded-xl p-2 sm:p-5 shadow-gold-glow relative group min-w-0">
                    <span className="font-couple text-2xl sm:text-5xl font-bold text-gold-deep block leading-none drop-shadow-sm group-hover:scale-105 transition-transform">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] sm:text-xs font-heading font-bold text-maroon uppercase tracking-wider mt-2 block truncate">
                      Seconds
                    </span>
                    {/* Glowing corner indicator */}
                    <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-1.5 h-1.5 rounded-full bg-gold animate-ping" />
                  </div>

                </div>

                <div className="mt-8 flex items-center justify-center space-x-2 text-xs sm:text-sm text-dark-muted font-heading font-medium">
                  <Calendar className="w-4 h-4 text-gold-deep" />
                  <span>
                    {settings.wedding_date} at {settings.wedding_start_time || '18:30'} ({settings.time_zone || 'IST'})
                  </span>
                </div>

              </div>
            </TiltCard>
          )}
        </RevealOnScroll>

      </div>
    </section>
  );
};
