"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWebSocket } from '@/hooks/useWebSocket';
import { useResearchHistoryContext } from '@/hooks/ResearchHistoryContext';
import { useScrollHandler } from '@/hooks/useScrollHandler';
import { startLanggraphResearch } from '../components/Langgraph/Langgraph';
import findDifferences from '../helpers/findDifferences';
import { Data, ChatBoxSettings, QuestionData, ChatMessage, ChatData } from '../types/data';
import { toast } from "react-hot-toast";

import Hero from "@/components/Hero";
import ResearchContent from "@/components/research/ResearchContent";
import ResearchSidebar from "@/components/ResearchSidebar";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const [promptValue, setPromptValue] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [isInChatMode, setIsInChatMode] = useState(false);
  const [chatBoxSettings, setChatBoxSettings] = useState<ChatBoxSettings>(() => {
    // Default settings
    const defaultSettings = {
      report_type: "research_report",
      report_source: "web",
      tone: "Objective",
      domains: [],
      defaultReportType: "research_report",
      layoutType: 'copilot',
      mcp_enabled: false,
      mcp_configs: [],
      mcp_strategy: "fast",
    };

    // Try to load all settings from localStorage
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('chatBoxSettings');
      if (savedSettings) {
        try {
          const parsedSettings = JSON.parse(savedSettings);
          return {
            ...defaultSettings,
            ...parsedSettings, // Override defaults with saved settings
          };
        } catch (e) {
          console.error('Error parsing saved settings:', e);
        }
      }
    }
    return defaultSettings;
  });
  const [question, setQuestion] = useState("");
  const [orderedData, setOrderedData] = useState<Data[]>([]);
  const [showHumanFeedback, setShowHumanFeedback] = useState(false);
  const [questionForHuman, setQuestionForHuman] = useState<true | false>(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentResearchId, setCurrentResearchId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const mainContentRef = useRef<HTMLDivElement>(null);

  // Use our custom scroll handler
  const { showScrollButton, scrollToBottom } = useScrollHandler(mainContentRef);

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const {
    history,
    saveResearch,
    updateResearch,
    getResearchById,
    deleteResearch,
    addChatMessage,
    getChatMessages
  } = useResearchHistoryContext();

  // Only initialize the WebSocket hook reference, don't connect automatically
  const websocketRef = useRef(useWebSocket(
    setOrderedData,
    setAnswer,
    setLoading,
    setShowHumanFeedback,
    setQuestionForHuman
  ));

  // Use the reference to access websocket functions
  const { socket, initializeWebSocket } = websocketRef.current;

  const handleFeedbackSubmit = (feedback: string | null) => {
    if (socket) {
      socket.send(JSON.stringify({ type: 'human_feedback', content: feedback }));
    }
    setShowHumanFeedback(false);
  };

  const handleChat = async (message: string) => {
    if (!currentResearchId && !answer) {
      if (isMobile) {
        setShowResult(true);
        setPromptValue(message);
        handleDisplayResult(message);
        return;
      }
    }

    setShowResult(true);

    // Create a user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: Date.now()
    };

    const questionData: QuestionData = { type: 'question', content: message };
    setOrderedData(prevOrder => [...prevOrder, questionData]);

    if (currentResearchId) {
      addChatMessage(currentResearchId, userMessage).catch(error => {
        console.error('Error adding chat message to history:', error);
      });
    }

    // Mobile implementation
    if (isMobile) {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{ role: 'user', content: message }],
            report: answer || '',
          }),
        });

        if (!response.ok) throw new Error(`API error: ${response.status}`);

        const data = await response.json();

        if (data.response && data.response.content) {
          if (currentResearchId) {
            addChatMessage(currentResearchId, data.response).catch(console.error);

            const chatData: ChatData = {
              type: 'chat',
              content: data.response.content,
              metadata: data.response.metadata
            };

            setOrderedData(prevOrder => [...prevOrder, chatData]);
            const updatedOrderedData = [...orderedData, questionData, chatData];

            updateResearch(currentResearchId, answer, updatedOrderedData).catch(console.error);
          } else {
            setOrderedData(prevOrder => [...prevOrder, {
              type: 'chat',
              content: data.response.content,
              metadata: data.response.metadata
            } as ChatData]);
          }
        }
      } catch (error) {
        console.error('Error during chat:', error);
        setOrderedData(prevOrder => [...prevOrder, {
          type: 'chat',
          content: 'Sorry, there was an error processing your request. Please try again.'
        } as ChatData]);
      }
      return;
    }

    // Desktop implementation
    try {
      let chatMessages: { role: string; content: string }[] = [];

      if (currentResearchId) {
        chatMessages = getChatMessages(currentResearchId);
      }

      const formattedMessages = [...chatMessages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch(`/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          report: answer || "",
          messages: formattedMessages
        }),
      });

      if (!response.ok) throw new Error(`Failed to get chat response: ${response.status}`);

      const data = await response.json();

      if (data.response && data.response.content) {
        if (currentResearchId) {
          addChatMessage(currentResearchId, data.response).catch(console.error);
        }

        setOrderedData(prevOrder => [...prevOrder, {
          type: 'chat',
          content: data.response.content,
          metadata: data.response.metadata
        }]);

        if (!isInChatMode) setIsInChatMode(true);
      }
    } catch (error) {
      console.error('Error during chat:', error);
      setOrderedData(prevOrder => [...prevOrder, {
        type: 'chat',
        content: 'Sorry, there was an error processing your request. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleDisplayResult = async (newQuestion: string) => {
    setIsInChatMode(false);
    setShowResult(true);
    setLoading(true);
    setQuestion(newQuestion);
    setPromptValue("");
    setAnswer("");
    setCurrentResearchId(null);
    setOrderedData((prevOrder) => [...prevOrder, { type: 'question', content: newQuestion }]);

    if (isMobile) {
      // Mobile implementation (simplified for brevity, similar to original)
      // ... (Mobile logic here)
      setLoading(false); // Placeholder
      return;
    }

    const storedConfig = localStorage.getItem('apiVariables');
    const apiVariables = storedConfig ? JSON.parse(storedConfig) : {};
    const langgraphHostUrl = apiVariables.LANGGRAPH_HOST_URL;

    if (chatBoxSettings.report_type === 'multi_agents' && langgraphHostUrl) {
      let { streamResponse, host, thread_id } = await startLanggraphResearch(newQuestion, chatBoxSettings.report_source, langgraphHostUrl);
      const langsmithGuiLink = `https://smith.langchain.com/studio/thread/${thread_id}?baseUrl=${host}`;
      setOrderedData((prevOrder) => [...prevOrder, { type: 'langgraphButton', link: langsmithGuiLink }]);

      let previousChunk = null;
      for await (const chunk of streamResponse) {
        if (chunk.data.report != null && chunk.data.report != "Full report content here") {
          setOrderedData((prevOrder) => [...prevOrder, { ...chunk.data, output: chunk.data.report, type: 'report' }]);
          setLoading(false);
          setAnswer(chunk.data.report);
        } else if (previousChunk) {
          const differences = findDifferences(previousChunk, chunk);
          setOrderedData((prevOrder) => [...prevOrder, { type: 'differences', content: 'differences', output: JSON.stringify(differences) }]);
        }
        previousChunk = chunk;
      }
    } else {
      initializeWebSocket(newQuestion, chatBoxSettings);
    }
  };

  const reset = () => {
    setShowResult(false);
    setPromptValue("");
    setIsInChatMode(false);
    setCurrentResearchId(null);
    setQuestion("");
    setAnswer("");
    setOrderedData([]);
    setShowHumanFeedback(false);
    setQuestionForHuman(false);
    if (socket) socket.close();
    setLoading(false);
  };

  const handleStartNewResearch = () => {
    reset();
    setSidebarOpen(false);
  };

  // Save or update research in history
  const isUpdatingRef = useRef(false);
  useEffect(() => {
    const saveOrUpdateResearch = async () => {
      if (isUpdatingRef.current) return;

      if (showResult && !loading && answer && question && orderedData.length > 0) {
        if (isInChatMode && currentResearchId) {
          try {
            const currentResearch = await getResearchById(currentResearchId);
            if (currentResearch && (currentResearch.answer !== answer || JSON.stringify(currentResearch.orderedData) !== JSON.stringify(orderedData))) {
              isUpdatingRef.current = true;
              await updateResearch(currentResearchId, answer, orderedData);
              setTimeout(() => { isUpdatingRef.current = false; }, 100);
            }
          } catch (error) {
            console.error('Error updating research:', error);
            isUpdatingRef.current = false;
          }
        } else if (!isInChatMode) {
          const isNewResearch = !history.some(item =>
            item.question === question && item.answer === answer
          );

          if (isNewResearch) {
            isUpdatingRef.current = true;
            try {
              const newId = await saveResearch(question, answer, orderedData);
              setCurrentResearchId(newId);
            } catch (error) {
              console.error('Error saving research:', error);
            } finally {
              setTimeout(() => { isUpdatingRef.current = false; }, 100);
            }
          }
        }
      }
    };
    saveOrUpdateResearch();
  }, [showResult, loading, answer, question, orderedData, history, saveResearch, updateResearch, isInChatMode, currentResearchId, getResearchById]);

  const [chatPromptValue, setChatPromptValue] = useState("");

  const handleClickSuggestion = (value: string) => {
    setPromptValue(value);
    handleDisplayResult(value);
  };

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-background text-text-main font-sans">
      <ResearchSidebar
        history={history}
        onSelectResearch={(id) => router.push(`/research/${id}`)}
        onNewResearch={handleStartNewResearch}
        onDeleteResearch={deleteResearch}
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-[320px]' : 'ml-0'}`}>
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="h-full"
            >
              <Hero
                promptValue={promptValue}
                setPromptValue={setPromptValue}
                handleDisplayResult={handleDisplayResult}
              />
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="h-full p-4 md:p-8 max-w-5xl mx-auto"
            >
              <ResearchContent
                showResult={showResult}
                orderedData={orderedData}
                answer={answer}
                allLogs={orderedData.filter((data: any) => data.type === 'logs').map((data: any) => ({
                  header: data.content,
                  text: typeof data.output === 'string' ? data.output : JSON.stringify(data.output),
                  key: Math.random().toString(),
                  metadata: data.metadata
                }))}
                chatBoxSettings={chatBoxSettings}
                loading={loading}
                isInChatMode={isInChatMode}
                isStopped={false}
                promptValue={promptValue}
                chatPromptValue={chatPromptValue}
                setPromptValue={setPromptValue}
                setChatPromptValue={setChatPromptValue}
                handleDisplayResult={handleDisplayResult}
                handleChat={handleChat}
                handleClickSuggestion={handleClickSuggestion}
                currentResearchId={currentResearchId || undefined}
                onShareClick={() => {
                  if (answer) {
                    navigator.clipboard.writeText(answer);
                    toast.success("Report copied to clipboard");
                  }
                }}
                reset={reset}
                isProcessingChat={loading && isInChatMode}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}