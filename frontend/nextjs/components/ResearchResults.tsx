import React from 'react';
import Question from './ResearchBlocks/Question';
import Report from './ResearchBlocks/Report';
import Sources from './ResearchBlocks/Sources';
import ImageSection from './ResearchBlocks/ImageSection';
import SubQuestions from './ResearchBlocks/elements/SubQuestions';
import LogsSection from './ResearchBlocks/LogsSection';
import AccessReport from './ResearchBlocks/AccessReport';
import { preprocessOrderedData } from '../utils/dataProcessing';
import { Data } from '../types/data';

interface ResearchResultsProps {
  orderedData: Data[];
  answer: string;
  allLogs: any[];
  chatBoxSettings: any;
  handleClickSuggestion: (value: string) => void;
  currentResearchId?: string;
  isProcessingChat?: boolean;
  onShareClick?: () => void;
}

export const ResearchResults: React.FC<ResearchResultsProps> = ({
  orderedData,
  answer,
  allLogs,
  chatBoxSettings,
  handleClickSuggestion,
  currentResearchId,
  isProcessingChat = false,
  onShareClick
}) => {
  const groupedData = preprocessOrderedData(orderedData);
  const pathData = groupedData.find(data => data.type === 'path');
  const initialQuestion = groupedData.find(data => data.type === 'question');

  const chatComponents = groupedData
    .filter(data => {
      if (data.type === 'question' && data === initialQuestion) {
        return false;
      }
      return (data.type === 'question' || data.type === 'chat');
    })
    .map((data, index) => {
      if (data.type === 'question') {
        return <Question key={`question-${index}`} question={data.content} />;
      } else {
        return <Report key={`chat-${index}`} answer={data.content} />;
      }
    });

  const sourceComponents = groupedData
    .filter(data => data.type === 'sourceBlock')
    .map((data, index) => (
      <Sources key={`sourceBlock-${index}`} sources={data.items} />
    ));

  const imageComponents = groupedData
    .filter(data => data.type === 'imagesBlock')
    .map((data, index) => (
      <ImageSection key={`images-${index}-${data.metadata?.length || 0}`} metadata={data.metadata} />
    ));

  const initialReport = groupedData.find(data => data.type === 'reportBlock');
  const finalReport = groupedData
    .filter(data => data.type === 'reportBlock')
    .pop();
  const subqueriesComponent = groupedData.find(data => data.content === 'subqueries');

  // If we have chat components (follow-up conversation), render them sequentially
  // Otherwise, render the dashboard view for the initial research
  if (chatComponents.length > 0) {
    return (
      <div className="space-y-6">
        {/* Original Dashboard for context */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12 opacity-80 hover:opacity-100 transition-opacity">
          <div className="lg:col-span-12">
            {initialQuestion && <Question question={initialQuestion.content} />}
          </div>
          {finalReport && (
            <div className="lg:col-span-12">
              <Report answer={finalReport.content} researchId={currentResearchId} />
            </div>
          )}
        </div>

        {/* Chat Conversation */}
        <div className="border-t border-border-subtle pt-8">
          <h3 className="text-xl font-bold text-accent-cyan mb-6 px-4">Follow-up Discussion</h3>
          <div className="space-y-6">
            {chatComponents}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in-up">
      {/* 1. Mission Objective (Full Width) */}
      <div className="lg:col-span-12">
        {initialQuestion && <Question question={initialQuestion.content} />}
      </div>

      {/* 2. Agent Terminal & Resources (Split View) */}
      <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Agent Terminal (Logs) */}
        <div className="flex flex-col gap-6">
          {orderedData.length > 0 && <LogsSection logs={allLogs} />}
          {subqueriesComponent && (
            <SubQuestions
              metadata={subqueriesComponent.metadata}
              handleClickSuggestion={handleClickSuggestion}
            />
          )}
        </div>

        {/* Right Column: Resources (Sources & Images) */}
        <div className="flex flex-col gap-6">
          {sourceComponents}
          {imageComponents}
        </div>
      </div>

      {/* 3. Mission Report (Full Width) */}
      <div className="lg:col-span-12 mt-4">
        {finalReport && <Report answer={finalReport.content} researchId={currentResearchId} />}
        {pathData && <AccessReport accessData={pathData.output} report={answer} chatBoxSettings={chatBoxSettings} onShareClick={onShareClick} />}
      </div>
    </div>
  );
}; 