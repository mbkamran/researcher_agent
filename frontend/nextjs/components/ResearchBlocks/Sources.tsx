import React from 'react';
import SourceCard from "./elements/SourceCard";

export default function Sources({
  sources,
  compact = false,
}: {
  sources: { name: string; url: string }[];
  compact?: boolean;
}) {
  if (compact) {
    // Compact version for chat responses
    return (
      <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
        <div className="flex w-full flex-wrap content-center items-center gap-2">
          {sources.map((source) => {
            // Extract domain from URL
            let displayUrl = source.url;
            try {
              const urlObj = new URL(source.url);
              displayUrl = urlObj.hostname.replace(/^www\./, '');
            } catch (e) {
              // If URL parsing fails, use the original URL
            }

            return (
              <a
                key={source.url}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2 py-1 text-xs bg-surface/60 text-text-muted hover:text-primary hover:bg-surface/90 rounded border border-border-subtle hover:border-primary/30 transition-all duration-200"
                title={source.name}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                {displayUrl}
              </a>
            );
          })}
        </div>
      </div>
    );
  }

  // Full version for research results
  return (
    <div className="w-full p-6 rounded-xl bg-surface/50 backdrop-blur-md border border-border-subtle/50">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-accent-purple/10 text-accent-purple">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-text-main">
          {sources.length} Sources Analyzed
        </h3>
      </div>

      <div className="overflow-y-auto max-h-[300px] custom-scrollbar pr-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sources.length > 0 ? (
            sources.map((source) => (
              <SourceCard source={source} key={source.url} />
            ))
          ) : (
            // Skeleton loading state
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 w-full animate-pulse rounded-lg bg-white/5" />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
