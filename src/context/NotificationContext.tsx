import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'info';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
}

interface NotificationContextType {
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
  dismiss: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  showSuccess: () => {},
  showError: () => {},
  showInfo: () => {},
  dismiss: () => {},
});

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addNotification = useCallback((type: NotificationType, message: string, title?: string) => {
    const id = 'notif_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const item: NotificationItem = { id, type, message, title };

    setNotifications((prev) => [item, ...prev.slice(0, 2)]); // Keep at most 3 visible

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      dismiss(id);
    }, 3200);
  }, [dismiss]);

  const showSuccess = useCallback((message: string, title = 'Success') => {
    addNotification('success', message, title);
  }, [addNotification]);

  const showError = useCallback((message: string, title = 'Attention Required') => {
    addNotification('error', message, title);
  }, [addNotification]);

  const showInfo = useCallback((message: string, title = 'Notice') => {
    addNotification('info', message, title);
  }, [addNotification]);

  return (
    <NotificationContext.Provider value={{ showSuccess, showError, showInfo, dismiss }}>
      {children}

      {/* Floating Notification Container (non-blocking pointer-events-none) */}
      <div 
        aria-live="polite"
        className="fixed top-5 right-4 sm:right-6 z-[9999] flex flex-col space-y-3 pointer-events-none max-w-sm w-full"
      >
        {notifications.map((item) => (
          <div
            key={item.id}
            role="status"
            className={`pointer-events-auto w-full rounded-2xl p-4 shadow-2xl border backdrop-blur-md transition-all duration-300 ease-out transform translate-y-0 opacity-100 flex items-start space-x-3 ${
              item.type === 'success'
                ? 'bg-[#FFFDF9]/95 border-emerald-500/40 text-gray-900 shadow-emerald-900/10'
                : item.type === 'error'
                ? 'bg-[#FFFDF9]/95 border-red-500/40 text-gray-900 shadow-red-900/10'
                : 'bg-[#FFFDF9]/95 border-gold/40 text-gray-900 shadow-gold-glow'
            }`}
            style={{
              boxShadow: item.type === 'success'
                ? '0 10px 25px -5px rgba(16, 185, 129, 0.2), 0 0 0 1px rgba(16, 185, 129, 0.25)'
                : '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(212, 175, 55, 0.25)'
            }}
          >
            {/* Indicator Icon */}
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
              item.type === 'success'
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                : item.type === 'error'
                ? 'bg-red-100 text-red-700 border border-red-300'
                : 'bg-gold/20 text-maroon border border-gold/40'
            }`}>
              {item.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {item.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
              {item.type === 'info' && <Info className="w-5 h-5 text-gold-deep" />}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pt-0.5">
              {item.title && (
                <p className={`text-xs font-heading font-bold uppercase tracking-wider ${
                  item.type === 'success' ? 'text-emerald-800' : item.type === 'error' ? 'text-red-800' : 'text-maroon'
                }`}>
                  {item.title}
                </p>
              )}
              <p className="text-xs sm:text-sm font-medium text-gray-800 break-words mt-0.5">
                {item.message}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => dismiss(item.id)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100/80 transition-colors flex-shrink-0 cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);

