import React from 'react';

interface QuestionProps {
  question: string;
}

const Question: React.FC<QuestionProps> = ({ question }) => {
  return (
    <div className="relative group">
      {/* Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent-cyan rounded-xl opacity-30 group-hover:opacity-60 blur transition duration-500"></div>

      <div className="relative flex flex-col sm:flex-row items-start gap-4 p-6 rounded-xl bg-surface/90 backdrop-blur-xl border border-border-light shadow-2xl">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>

        <div className="flex-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-accent-cyan mb-1">Mission Objective</h3>
          <p className="text-lg sm:text-xl font-medium text-white leading-relaxed">
            {question}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Question;
