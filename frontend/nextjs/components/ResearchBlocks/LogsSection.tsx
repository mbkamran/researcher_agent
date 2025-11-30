import Image from "next/image";
import LogMessage from './elements/LogMessage';
import { useEffect, useRef } from 'react';

interface Log {
  header: string;
  text: string;
  metadata: any;
  key: string;
}

interface OrderedLogsProps {
  logs: Log[];
}

const LogsSection = ({ logs }: OrderedLogsProps) => {
  const logsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom whenever logs change
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="w-full rounded-xl bg-surface/80 backdrop-blur-xl border border-border-light shadow-lg overflow-hidden flex flex-col h-[400px]">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
          </div>
          <h3 className="text-xs font-mono uppercase tracking-widest text-text-muted ml-2">
            Agent Terminal
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] font-mono text-green-500 uppercase">Live</span>
        </div>
      </div>

      {/* Logs Area */}
      <div
        ref={logsContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-sm custom-scrollbar bg-black/40"
      >
        <LogMessage logs={logs} />
      </div>
    </div>
  );
};

export default LogsSection; 