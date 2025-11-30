import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ResearchHistoryItem } from '../types/data';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

interface ResearchSidebarProps {
  history: ResearchHistoryItem[];
  onSelectResearch: (id: string) => void;
  onNewResearch: () => void;
  onDeleteResearch: (id: string) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const ResearchSidebar: React.FC<ResearchSidebarProps> = ({
  history,
  onSelectResearch,
  onNewResearch,
  onDeleteResearch,
  isOpen,
  toggleSidebar,
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)) {
        toggleSidebar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, toggleSidebar]);

  const formatTimestamp = (timestamp: number | string | Date | undefined) => {
    if (!timestamp) return 'Unknown time';

    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return 'Unknown time';
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return 'Unknown time';
    }
  };

  const sidebarVariants = {
    open: {
      width: 'var(--sidebar-width)',
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    closed: {
      width: '0px',
      x: -20,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={toggleSidebar}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <motion.div
        ref={sidebarRef}
        className="fixed top-0 left-0 h-full z-50 overflow-hidden"
        variants={sidebarVariants}
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        style={{
          '--sidebar-width': '320px',
        } as React.CSSProperties}
      >
        <div className="h-full w-[320px] bg-surface/95 backdrop-blur-2xl border-r border-border-subtle shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-border-subtle flex justify-between items-center bg-gradient-to-r from-surface to-background">
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-cyan">
              History
            </h2>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-text-main transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* New Research Button */}
          <div className="p-4">
            <button
              onClick={onNewResearch}
              className="w-full py-3 px-4 bg-gradient-to-r from-primary to-primary-hover text-white rounded-xl font-medium shadow-glow-sm hover:shadow-glow-md transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Research
            </button>
          </div>

          {/* History List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-text-muted opacity-60">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <p className="text-sm">No research history yet</p>
              </div>
            ) : (
              history.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="group relative"
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Link
                    href={`/research/${item.id}`}
                    className="block p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-border-light transition-all duration-200"
                    onClick={(e) => {
                      if (isOpen) {
                        onSelectResearch(item.id);
                        toggleSidebar();
                      }
                    }}
                  >
                    <h3 className="text-sm font-medium text-text-main line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                      {item.question}
                    </h3>
                    <div className="flex items-center text-xs text-text-muted">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatTimestamp(item.timestamp || (item as any).updated_at || (item as any).created_at)}
                    </div>
                  </Link>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      onDeleteResearch(item.id);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-surface/80 text-text-muted hover:text-red-400 hover:bg-surface opacity-0 group-hover:opacity-100 transition-all duration-200"
                    aria-label="Delete research"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ResearchSidebar;