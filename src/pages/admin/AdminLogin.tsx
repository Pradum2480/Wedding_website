import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getSupabaseConfig } from '../../services/supabase';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  Key, 
  Phone, 
  Eye, 
  EyeOff, 
  ShieldAlert, 
  ShieldCheck 
} from 'lucide-react';

const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 60;

export const AdminLogin: React.FC = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const config = getSupabaseConfig();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Rate-limiting / brute-force protection
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  // Lockout countdown timer
  useEffect(() => {
    let timer: any;
    if (lockoutRemaining > 0) {
      timer = setInterval(() => {
        setLockoutRemaining((prev) => {
          if (prev <= 1) {
            setFailedAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [lockoutRemaining]);

  const isLockedOut = lockoutRemaining > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLockedOut) return;

    setErrorMessage('');
    setIsLoading(true);

    const res = await signIn(email, password);

    if (res.success) {
      setFailedAttempts(0);
      navigate('/admin/dashboard');
    } else {
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);

      if (nextAttempts >= MAX_ATTEMPTS) {
        setLockoutRemaining(LOCKOUT_SECONDS);
        setErrorMessage(`Too many failed login attempts. For security, login is locked for ${LOCKOUT_SECONDS} seconds.`);
      } else {
        const remainingTries = MAX_ATTEMPTS - nextAttempts;
        setErrorMessage(
          `${res.error || 'Invalid email or password.'} (${remainingTries} attempt${remainingTries === 1 ? '' : 's'} remaining)`
        );
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-mandala-pattern flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Card */}
        <div className="bg-[#FFFDF9] rounded-2xl border-2 border-gold shadow-gold-glow-lg p-8 sm:p-10 relative">
          
          {/* Logo / Monogram */}
          <div className="w-16 h-16 rounded-full bg-maroon border-2 border-gold flex items-center justify-center mx-auto mb-4 text-gold shadow-md">
            <Lock className="w-7 h-7" />
          </div>

          <div className="text-center mb-6">
            <h1 className="font-couple text-2xl sm:text-3xl font-bold text-maroon">
              Admin Portal Login
            </h1>
            <p className="font-heading text-xs uppercase tracking-widest text-gold-deep mt-1 font-semibold">
              Royal Wedding Management
            </p>
          </div>

          {errorMessage && (
            <div className={`mb-4 p-3 rounded-xl border text-xs flex items-center space-x-2 ${
              isLockedOut ? 'bg-amber-50 border-amber-300 text-amber-800' : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              {isLockedOut ? (
                <ShieldAlert className="w-4 h-4 flex-shrink-0 text-amber-600" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
              )}
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-xs font-heading uppercase tracking-wider font-bold text-dark-text mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  disabled={isLockedOut || isLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@wedding.com"
                  className="w-full px-4 py-2.5 pl-10 rounded-xl border border-gold/40 bg-white focus:outline-none focus:ring-2 focus:ring-gold/60 text-sm font-heading disabled:bg-gray-100 disabled:opacity-60"
                />
                <Mail className="w-4 h-4 text-gold-deep absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-heading uppercase tracking-wider font-bold text-dark-text mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={isLockedOut || isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 pl-10 pr-10 rounded-xl border border-gold/40 bg-white focus:outline-none focus:ring-2 focus:ring-gold/60 text-sm font-heading disabled:bg-gray-100 disabled:opacity-60"
                />
                <Key className="w-4 h-4 text-gold-deep absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  disabled={isLockedOut || isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold-deep cursor-pointer p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || isLockedOut}
              className="btn-royal-maroon w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>
                {isLockedOut
                  ? `Locked (${lockoutRemaining}s)`
                  : isLoading
                  ? 'Verifying Credentials...'
                  : 'Sign In to Dashboard'}
              </span>
              <ArrowRight className="w-4 h-4 text-gold" />
            </button>

          </form>

          {/* Security & Access Notice */}
          <div className="mt-6 pt-4 border-t border-gold/20 text-center">
            <div className="inline-flex items-center space-x-1.5 text-xs text-gray-500 font-heading">
              <ShieldCheck className="w-4 h-4 text-gold-deep" />
              <span>Restricted Administrator Access</span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              Unauthorized access attempts are monitored and rate-limited.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-gold/15 text-center flex flex-col items-center gap-2">
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-dark-muted font-heading">
              <span>Admin Support:</span>
              <span className="text-dark-text font-semibold">+91 7620 598 347</span>
              <div className="inline-flex items-center space-x-1.5 ml-1">
                <a
                  href="tel:+917620598347"
                  className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-gold/15 hover:bg-gold/30 text-gold-deep text-[11px] font-semibold transition-colors"
                  title="Direct Phone Call"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call</span>
                </a>
                <a
                  href="https://wa.me/917620598347?text=Hello%20Admin%2C%20I%20need%20assistance%20with%20the%20Wedding%20Admin%20Portal."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] text-[11px] font-semibold transition-colors"
                  title="Chat on WhatsApp"
                >
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
            <Link
              to="/"
              className="text-xs text-dark-muted hover:text-gold-deep transition-colors"
            >
              &larr; Return to Public Wedding Invitation
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};
