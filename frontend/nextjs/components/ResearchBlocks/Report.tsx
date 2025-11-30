import React, { useState, useEffect } from 'react';
import { toast } from "react-hot-toast";
import { markdownToHtml } from '../../helpers/markdownHelper';
import '../../styles/markdown.css';
import { useResearchHistoryContext } from '../../hooks/ResearchHistoryContext';

export default function Report({ answer, researchId }: { answer: string, researchId?: string }) {
  const [htmlContent, setHtmlContent] = useState('');
  const { getChatMessages } = useResearchHistoryContext();

  useEffect(() => {
    if (answer) {
      markdownToHtml(answer).then((html) => setHtmlContent(html));
    }
  }, [answer]);

  return (
    <div className="w-full rounded-xl bg-surface/90 backdrop-blur-xl border border-border-light shadow-2xl overflow-hidden">
      {/* Report Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-surface to-background border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">Mission Report</h3>
        </div>

        {answer && (
          <button
            onClick={() => {
              navigator.clipboard.writeText(answer.trim());
              toast.success("Report copied to clipboard");
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-muted hover:text-white transition-all duration-200 border border-transparent hover:border-white/10"
            title="Copy Report"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-medium">Copy</span>
          </button>
        )}
      </div>

      {/* Report Content */}
      <div className="p-6 sm:p-8">
        <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-primary prose-strong:text-white prose-code:text-accent-cyan prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10">
          {answer ? (
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          ) : (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-white/5 rounded w-3/4"></div>
              <div className="h-4 bg-white/5 rounded w-full"></div>
              <div className="h-4 bg-white/5 rounded w-5/6"></div>
              <div className="h-4 bg-white/5 rounded w-2/3"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 