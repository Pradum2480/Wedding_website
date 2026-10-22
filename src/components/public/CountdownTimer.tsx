import React, { useState, useEffect } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { RoyalDivider } from '../common/RoyalDivider';
import { Clock, Heart, Calendar } from 'lucide-react';

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
    // If no valid wedding date, fallback safely
    if (!settings.wedding_date) return;

    const calculateTimeLeft = (): TimeLeft => {
      try {
        // Construct target ISO string in configured time zone (default Asia/Kolkata +05:30)
        // Format: YYYY-MM-DDTHH:mm:00
        const dateStr = settings.wedding_date;
        const timeStr = settings.wedding_start_time || '18:30';
        
        // Target timestamp
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

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second in the browser only (no DB request per second!)
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [settings.wedding_date, settings.wedding_start_time, settings.time_zone]);

  return (
    <section id="countdown" className="py-12 px-4 relative z-10">
      <div className="max-w-4xl mx-auto text-center">
        
        {timeLeft.isPassed ? (
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
        ) : (
          <div className="royal-card corner-flourish rounded-2xl p-6 sm:p-10 border-2 border-gold/40 bg-gradient-to-b from-[#FFFDF9] to-[#FFF8E7] shadow-card-luxury">
            
            <div className="flex items-center justify-center space-x-2 text-gold-deep mb-2">
              <Clock className="w-4 h-4" />
              <span className="font-heading uppercase tracking-[0.2em] text-xs font-semibold">
                Countdown to the Auspicious Hour
              </span>
            </div>

            <h2 className="font-couple text-2xl sm:text-4xl text-maroon font-bold mb-2">
              The Royal Celebration Awaits
            </h2>

            <p className="font-heading text-sm sm:text-base text-dark-muted mb-8 max-w-lg mx-auto">
              Counting down every cherished second until we take our sacred vows.
            </p>

            {/* Countdown Grid (Days, Hours, Minutes, Seconds) */}
            <div className="grid grid-cols-4 gap-2 sm:gap-6 max-w-2xl mx-auto">
              
              {/* Days */}
              <div className="bg-[#FFFFFF] border border-gold/40 rounded-xl p-3 sm:p-5 shadow-sm">
                <span className="font-couple text-2xl sm:text-5xl font-bold text-maroon block leading-none">
                  {String(timeLeft.days).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs font-heading font-semibold text-gold-deep uppercase tracking-wider mt-2 block">
                  Days
                </span>
              </div>

              {/* Hours */}
              <div className="bg-[#FFFFFF] border border-gold/40 rounded-xl p-3 sm:p-5 shadow-sm">
                <span className="font-couple text-2xl sm:text-5xl font-bold text-maroon block leading-none">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs font-heading font-semibold text-gold-deep uppercase tracking-wider mt-2 block">
                  Hours
                </span>
              </div>

              {/* Minutes */}
              <div className="bg-[#FFFFFF] border border-gold/40 rounded-xl p-3 sm:p-5 shadow-sm">
                <span className="font-couple text-2xl sm:text-5xl font-bold text-maroon block leading-none">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs font-heading font-semibold text-gold-deep uppercase tracking-wider mt-2 block">
                  Minutes
                </span>
              </div>

              {/* Seconds */}
              <div className="bg-[#FFFFFF] border border-gold/40 rounded-xl p-3 sm:p-5 shadow-sm animate-pulse-subtle">
                <span className="font-couple text-2xl sm:text-5xl font-bold text-gold-deep block leading-none">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs font-heading font-semibold text-maroon uppercase tracking-wider mt-2 block">
                  Seconds
                </span>
              </div>

            </div>

            <div className="mt-8 flex items-center justify-center space-x-2 text-xs sm:text-sm text-dark-muted font-heading">
              <Calendar className="w-4 h-4 text-gold-deep" />
              <span>
                {settings.wedding_date} at {settings.wedding_start_time || '18:30'} ({settings.time_zone || 'IST'})
              </span>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
