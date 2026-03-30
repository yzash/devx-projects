import React, { useState } from 'react';
import { FileDown, FileText, BookmarkPlus, User, Bot } from 'lucide-react';
import ChartRenderer from './ChartRenderer';
import FollowUpChips from './FollowUpChips';
import api from '../utils/api';

export default function MessageBubble({ message, onFollowUp, onSaveQuery }) {
  const { role, content, chartType, chartData, followUps, isStreaming, isError } = message;
  const [exporting, setExporting] = useState(false);

  const isUser = role === 'user';

  const handleExportPDF = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const response = await api.post('/api/reports/pdf', {
        question: message.question || '',
        answer: content,
        chartType,
        chartData,
        dateRange: null
      }, { responseType: 'blob' });

      const blob = new Blob([response.data], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ceo-report-${Date.now()}.html`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  const handleExportCSV = async () => {
    if (!chartData || exporting) return;
    setExporting(true);
    try {
      const response = await api.post('/api/reports/csv', { chartData }, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ceo-data-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('CSV export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  if (isUser) {
    return (
      <div className="flex justify-end mb-6 px-4">
        <div className="max-w-lg">
          <div className="bg-indigo-600 text-white px-4 py-3 rounded-2xl rounded-tr-sm shadow-sm">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 mb-6 px-4">
      <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mt-1">
        <Bot size={16} className="text-indigo-600" />
      </div>
      <div className="flex-1 min-w-0 max-w-3xl">
        <div className={`bg-white rounded-2xl rounded-tl-sm shadow-sm border ${isError ? 'border-red-200' : 'border-gray-200'} px-5 py-4`}>
          {/* Answer text */}
          <p className={`text-sm leading-relaxed whitespace-pre-wrap ${isError ? 'text-red-600' : 'text-gray-800'} ${isStreaming && !content ? 'streaming-cursor' : ''}`}>
            {content || (isStreaming ? '' : '...')}
            {isStreaming && content && <span className="streaming-cursor" />}
          </p>

          {/* Chart */}
          {chartData && !isStreaming && (
            <ChartRenderer chartType={chartType} chartData={chartData} />
          )}
        </div>

        {/* Action buttons */}
        {!isStreaming && !isError && content && (
          <div className="flex items-center gap-2 mt-2 ml-1">
            <button
              onClick={handleExportPDF}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FileText size={13} />
              Report
            </button>
            {chartData && (
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FileDown size={13} />
                CSV
              </button>
            )}
            {onSaveQuery && (
              <button
                onClick={() => onSaveQuery(message)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <BookmarkPlus size={13} />
                Save
              </button>
            )}
          </div>
        )}

        {/* Follow-up chips */}
        {!isStreaming && followUps && followUps.length > 0 && (
          <FollowUpChips followUps={followUps} onSelect={onFollowUp} />
        )}
      </div>
    </div>
  );
}
