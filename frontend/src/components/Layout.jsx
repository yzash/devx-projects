import React from 'react';
import Sidebar from './Sidebar';
import { ConversationProvider } from '../contexts/ConversationContext';

export default function Layout({ children }) {
  return (
    <ConversationProvider>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-hidden flex flex-col">
          {children}
        </main>
      </div>
    </ConversationProvider>
  );
}
