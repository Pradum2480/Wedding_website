import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WeddingProvider } from './context/WeddingContext';
import { PublicWebsite } from './pages/PublicWebsite';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminWeddingDetails } from './pages/admin/AdminWeddingDetails';
import { AdminEvents } from './pages/admin/AdminEvents';
import { AdminGallery } from './pages/admin/AdminGallery';
import { AdminAfterWedding } from './pages/admin/AdminAfterWedding';
import { AdminRSVPs } from './pages/admin/AdminRSVPs';
import { AdminSettings } from './pages/admin/AdminSettings';
import { ProtectedRoute } from './components/admin/ProtectedRoute';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WeddingProvider>
          <Routes>
            {/* Public Invitation Website */}
            <Route path="/" element={<PublicWebsite />} />

            {/* Admin Authentication */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/wedding-details"
              element={
                <ProtectedRoute>
                  <AdminWeddingDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/events"
              element={
                <ProtectedRoute>
                  <AdminEvents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/gallery"
              element={
                <ProtectedRoute>
                  <AdminGallery />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/after-wedding"
              element={
                <ProtectedRoute>
                  <AdminAfterWedding />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/rsvps"
              element={
                <ProtectedRoute>
                  <AdminRSVPs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute>
                  <AdminSettings />
                </ProtectedRoute>
              }
            />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </WeddingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
