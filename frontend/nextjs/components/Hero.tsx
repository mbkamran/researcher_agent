import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import InputArea from "./ResearchBlocks/elements/InputArea";
import { motion } from "framer-motion";

type THeroProps = {
  promptValue: string;
  setPromptValue: React.Dispatch<React.SetStateAction<string>>;
  handleDisplayResult: (query: string) => void;
};

const Hero: FC<THeroProps> = ({
  promptValue,
  setPromptValue,
  handleDisplayResult,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClickSuggestion = (value: string) => {
    setPromptValue(value);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-10">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 bg-hero-mesh opacity-60 z-0 pointer-events-none" />

      {/* Animated Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse-slow z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[128px] animate-pulse-slow delay-1000 z-0" />

      <div className="relative z-10 w-full max-w-5xl px-4 flex flex-col items-center gap-8">
        {/* Logo & Branding */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
            <div className="relative bg-surface p-4 rounded-2xl border border-border-subtle shadow-glass">
              <Image
                src="/img/gptr-black-logo.png"
                alt="Researcher Agent Logo"
                width={80}
                height={80}
                className="w-20 h-20 opacity-90 invert"
              />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70 tracking-tight">
            Research Intelligence
          </h1>
          <p className="text-text-muted text-lg md:text-xl text-center max-w-2xl">
            Autonomous agent for deep research and comprehensive reporting
          </p>
        </motion.div>

        {/* Search Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-3xl"
        >
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-accent-purple to-secondary rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
            <div className="relative bg-surface/80 backdrop-blur-xl rounded-2xl border border-border-light shadow-2xl overflow-hidden">
              <InputArea
                promptValue={promptValue}
                setPromptValue={setPromptValue}
                handleSubmit={handleDisplayResult}
              />
            </div>
          </div>
        </motion.div>

        {/* Suggestions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mt-4"
        >
          {suggestions.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleClickSuggestion(item.name)}
              className="group relative p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-300 text-left overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                  <img
                    src={item.icon}
                    alt={item.name}
                    className="w-5 h-5 invert opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <span className="text-sm font-medium text-text-muted group-hover:text-text-main transition-colors">
                  {item.label}
                </span>
              </div>
            </button>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const suggestions = [
  {
    id: 1,
    name: "Analyze the latest trends in AI agents",
    label: "AI Trends Analysis",
    icon: "/img/stock2.svg",
  },
  {
    id: 2,
    name: "Plan a 2-week itinerary for Japan",
    label: "Travel Planning",
    icon: "/img/hiker.svg",
  },
  {
    id: 3,
    name: "Latest developments in quantum computing",
    label: "Tech News",
    icon: "/img/news.svg",
  },
];

export default Hero;
