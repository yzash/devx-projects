import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Chat from './pages/Chat';

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading CEO Intelligence...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">CEO Intelligence Platform</h1>
          <p className="text-gray-500 mb-6">AI-powered business insights from your Zoho data</p>
          <a
            href="/auth/demo"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            Start Demo
          </a>
          <p className="text-xs text-gray-400 mt-4">No credentials required — uses realistic mock data</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/:conversationId" element={<Chat />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
