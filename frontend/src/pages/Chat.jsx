import React, { useEffect, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import ChatWindow from '../components/ChatWindow';
import { useChat } from '../hooks/useChat';
import { useConversations } from '../contexts/ConversationContext';
import api from '../utils/api';

export default function Chat() {
  const { conversationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { createConversation, updateConversationTitle, setActiveConversationId } = useConversations();

  const {
    messages,
    setMessages,
    isStreaming,
    submitQuery,
    stopStreaming
  } = useChat(conversationId);

  const handleSubmit = useCallback(async (message) => {
    let currentConvId = conversationId;

    // Create new conversation if we don't have one
    if (!currentConvId) {
      const title = message.slice(0, 60) + (message.length > 60 ? '...' : '');
      const conv = await createConversation(title);
      currentConvId = conv.id;
      navigate(`/chat/${currentConvId}`, { replace: true });
      // Update title
      updateConversationTitle(currentConvId, title);
    }

    submitQuery(message);
  }, [conversationId, createConversation, navigate, submitQuery, updateConversationTitle]);

  // Load messages if conversation ID provided
  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    setActiveConversationId(conversationId);

    async function loadMessages() {
      try {
        const res = await api.get(`/api/conversations/${conversationId}/messages`);
        const dbMessages = res.data.messages || [];
        const formatted = dbMessages.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content_json?.text || '',
          chartType: m.content_json?.chartType || null,
          chartData: m.content_json?.chartData || null,
          followUps: m.content_json?.followUps || [],
          timestamp: m.created_at,
          isStreaming: false
        }));
        setMessages(formatted);
      } catch (err) {
        console.warn('Could not load messages:', err.message);
      }
    }

    loadMessages();
  }, [conversationId, setMessages, setActiveConversationId]);

  // Handle initial message from navigation state (only on mount)
  useEffect(() => {
    const initialMessage = location.state?.initialMessage;
    if (initialMessage) {
      window.history.replaceState({}, '', window.location.pathname);
      setTimeout(() => handleSubmit(initialMessage), 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveQuery = useCallback(async (message) => {
    const label = message.content?.slice(0, 50) || 'Saved query';
    try {
      await api.post('/api/saved-queries', { label, queryText: message.content });
    } catch (err) {
      console.warn('Could not save query:', err.message);
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-white h-full overflow-hidden">
      <ChatWindow
        messages={messages}
        onSubmit={handleSubmit}
        isStreaming={isStreaming}
        onStop={stopStreaming}
        onSaveQuery={handleSaveQuery}
      />
    </div>
  );
}
