import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getSupabaseConfig } from '../../services/supabase';
import { 
  LayoutDashboard, 
  Heart, 
  Calendar, 
  Images, 
  FolderHeart, 
  Users, 
  Settings, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X, 
  Database,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, isAdmin, isDemoMode, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const config = getSupabaseConfig();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Wedding Details', path: '/admin/wedding-details', icon: Heart },
    { label: 'Events & Itinerary', path: '/admin/events', icon: Calendar },
    { label: 'Photo Gallery', path: '/admin/gallery', icon: Images },
    { label: 'After-Wedding Albums', path: '/admin/after-wedding', icon: FolderHeart },
    { label: 'RSVP Submissions', path: '/admin/rsvps', icon: Users },
    { label: 'Website Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* Top Navigation Bar */}
      <header className="bg-maroon text-cream border-b border-gold/40 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-maroon-rich text-gold hover:text-white"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/admin/dashboard" className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-full bg-maroon-deep border border-gold flex items-center justify-center text-gold font-couple font-bold">
                R
              </div>
              <div>
                <span className="font-couple font-bold text-gold text-lg tracking-wide hidden sm:inline">
                  Royal Wedding
                </span>
                <span className="text-[10px] font-heading uppercase tracking-widest block text-cream/70">
                  Admin Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Connection Status and Actions */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Supabase status badge */}
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-heading border bg-maroon-deep/80 border-gold/30">
              <Database className="w-3.5 h-3.5 text-gold" />
              {config.isConfigured ? (
                <span className="text-green-300 font-semibold flex items-center space-x-1">
                  <span>Supabase Live</span>
                </span>
              ) : (
                <span className="text-amber-300 font-medium">
                  Local Demo Mode
                </span>
              )}
            </div>

            {/* Preview Public Website */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg border border-gold/50 bg-gold/15 hover:bg-gold/25 text-gold text-xs font-semibold inline-flex items-center space-x-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Public Website</span>
            </a>

            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              className="p-2 rounded-lg text-cream/80 hover:text-white hover:bg-maroon-rich transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>

        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
        
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sticky top-24">
            
            <div className="px-3 py-2 mb-3 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Management
              </p>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-maroon text-gold font-semibold shadow-sm'
                        : 'text-gray-700 hover:bg-cream hover:text-maroon'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-gold' : 'text-gray-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-8 pt-4 border-t border-gray-100 px-3">
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <ShieldCheck className="w-4 h-4 text-gold-deep" />
                <span className="truncate">{user?.email || 'Admin Session'}</span>
              </div>
            </div>

          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white rounded-2xl border border-gray-200 p-4 shadow-md mb-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                    isActive
                      ? 'bg-maroon text-gold font-semibold'
                      : 'text-gray-700 hover:bg-cream'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {children}
        </main>

      </div>

    </div>
  );
};
