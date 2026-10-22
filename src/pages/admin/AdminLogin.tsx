import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getSupabaseConfig } from '../../services/supabase';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Sparkles, Key } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const config = getSupabaseConfig();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    const res = await signIn(email, password);

    if (res.success) {
      navigate('/admin/dashboard');
    } else {
      setErrorMessage(res.error || 'Invalid email or password.');
    }
    setIsLoading(false);
  };

  const handleFillDemo = () => {
    setEmail('admin@wedding.royal');
    setPassword('RoyalGold2026!');
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
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@wedding.royal"
                  className="w-full px-4 py-2.5 pl-10 rounded-xl border border-gold/40 bg-white focus:outline-none focus:ring-2 focus:ring-gold/60 text-sm font-heading"
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
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 pl-10 rounded-xl border border-gold/40 bg-white focus:outline-none focus:ring-2 focus:ring-gold/60 text-sm font-heading"
                />
                <Key className="w-4 h-4 text-gold-deep absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-royal-maroon w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
              <span>{isLoading ? 'Verifying Credentials...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4 text-gold" />
            </button>

          </form>

          {/* Quick Demo Credentials helper */}
          <div className="mt-6 pt-5 border-t border-gold/20 text-center">
            <p className="text-xs text-dark-muted font-heading mb-2">
              Evaluating locally or haven't connected Supabase yet?
            </p>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-xs font-semibold text-gold-deep hover:text-maroon underline inline-flex items-center space-x-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-deep" />
              <span>Click to auto-fill initial demo credentials</span>
            </button>
          </div>

          <div className="mt-4 text-center">
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
