import { useState, useCallback, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function useChat(conversationId = null) {
  const { token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState('');
  const abortRef = useRef(null);

  const submitQuery = useCallback(async (message) => {
    if (!message.trim() || isStreaming) return;

    // Add user message
    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsStreaming(true);
    setCurrentStreamingMessage('');

    // Build conversation history for context (last 10 messages)
    const historyForApi = messages.slice(-10).map(m => ({
      role: m.role,
      content: m.content
    }));

    // Placeholder assistant message
    const assistantMsgId = `assistant-${Date.now()}`;
    setMessages(prev => [...prev, {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      chartType: null,
      chartData: null,
      followUps: [],
      isStreaming: true,
      timestamp: new Date().toISOString()
    }]);

    try {
      const controller = new AbortController();
      abortRef.current = controller;

      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message,
          conversationHistory: historyForApi,
          conversationId
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let accumulatedText = '';
      let chartType = null;
      let chartData = null;
      let followUps = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (!jsonStr) continue;

          try {
            const event = JSON.parse(jsonStr);

            if (event.type === 'text') {
              accumulatedText += event.content;
              setCurrentStreamingMessage(accumulatedText);
              setMessages(prev => prev.map(m =>
                m.id === assistantMsgId
                  ? { ...m, content: accumulatedText, isStreaming: true }
                  : m
              ));
            } else if (event.type === 'chartData') {
              chartType = event.chartType;
              chartData = event.chartData;
              setMessages(prev => prev.map(m =>
                m.id === assistantMsgId
                  ? { ...m, chartType, chartData }
                  : m
              ));
            } else if (event.type === 'followUps') {
              followUps = event.followUps;
              setMessages(prev => prev.map(m =>
                m.id === assistantMsgId
                  ? { ...m, followUps }
                  : m
              ));
            } else if (event.type === 'done') {
              // Finalize message
              const finalText = event.answer || accumulatedText;
              const finalChartType = event.chartType || chartType;
              const finalChartData = event.chartData || chartData;
              const finalFollowUps = event.followUps || followUps;

              setMessages(prev => prev.map(m =>
                m.id === assistantMsgId
                  ? {
                      ...m,
                      content: finalText,
                      chartType: finalChartType,
                      chartData: finalChartData,
                      followUps: finalFollowUps,
                      isStreaming: false
                    }
                  : m
              ));
              setCurrentStreamingMessage('');
            } else if (event.type === 'error') {
              setMessages(prev => prev.map(m =>
                m.id === assistantMsgId
                  ? { ...m, content: `Error: ${event.error}`, isStreaming: false, isError: true }
                  : m
              ));
            }
          } catch (parseErr) {
            // Skip malformed SSE events
          }
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        setMessages(prev => prev.map(m =>
          m.id === assistantMsgId
            ? { ...m, content: m.content || 'Response cancelled.', isStreaming: false }
            : m
        ));
      } else {
        setMessages(prev => prev.map(m =>
          m.id === assistantMsgId
            ? { ...m, content: `Sorry, something went wrong: ${err.message}`, isStreaming: false, isError: true }
            : m
        ));
      }
    } finally {
      setIsStreaming(false);
      setCurrentStreamingMessage('');
      abortRef.current = null;
    }
  }, [messages, isStreaming, token, conversationId]);

  const stopStreaming = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setCurrentStreamingMessage('');
  }, []);

  return {
    messages,
    setMessages,
    isStreaming,
    currentStreamingMessage,
    submitQuery,
    stopStreaming,
    clearMessages
  };
}
