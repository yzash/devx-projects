import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const ConversationContext = createContext(null);

export function ConversationProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [savedQueries, setSavedQueries] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [loadingConversations, setLoadingConversations] = useState(false);

  const fetchConversations = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoadingConversations(true);
    try {
      const res = await api.get('/api/conversations');
      setConversations(res.data.conversations || []);
    } catch (err) {
      console.warn('Could not fetch conversations:', err.message);
    } finally {
      setLoadingConversations(false);
    }
  }, [isAuthenticated]);

  const fetchSavedQueries = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get('/api/saved-queries');
      setSavedQueries(res.data.savedQueries || []);
    } catch (err) {
      console.warn('Could not fetch saved queries:', err.message);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchConversations();
      fetchSavedQueries();
    }
  }, [isAuthenticated, fetchConversations, fetchSavedQueries]);

  const createConversation = useCallback(async (title) => {
    try {
      const res = await api.post('/api/conversations', { title });
      const newConv = res.data.conversation;
      setConversations(prev => [newConv, ...prev]);
      return newConv;
    } catch (err) {
      const fallback = { id: `local-${Date.now()}`, title: title || 'New Conversation', created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
      setConversations(prev => [fallback, ...prev]);
      return fallback;
    }
  }, []);

  const saveQuery = useCallback(async (label, queryText) => {
    try {
      const res = await api.post('/api/saved-queries', { label, queryText });
      setSavedQueries(prev => [...prev, res.data.savedQuery]);
      return res.data.savedQuery;
    } catch (err) {
      console.warn('Could not save query:', err.message);
    }
  }, []);

  const deleteSavedQuery = useCallback(async (id) => {
    try {
      await api.delete(`/api/saved-queries/${id}`);
      setSavedQueries(prev => prev.filter(q => q.id !== id));
    } catch (err) {
      console.warn('Could not delete saved query:', err.message);
    }
  }, []);

  const updateConversationTitle = useCallback((id, title) => {
    setConversations(prev => prev.map(c => c.id === id ? { ...c, title } : c));
  }, []);

  return (
    <ConversationContext.Provider value={{
      conversations,
      savedQueries,
      activeConversationId,
      setActiveConversationId,
      loadingConversations,
      fetchConversations,
      createConversation,
      saveQuery,
      deleteSavedQuery,
      updateConversationTitle,
    }}>
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversations() {
  const ctx = useContext(ConversationContext);
  if (!ctx) throw new Error('useConversations must be used within ConversationProvider');
  return ctx;
}
