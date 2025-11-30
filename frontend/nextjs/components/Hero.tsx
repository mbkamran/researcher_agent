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
            <div className="w-24 h-24 rounded-2xl bg-surface/50 backdrop-blur-xl border border-border-light flex items-center justify-center mb-8 shadow-2xl shadow-primary/20 animate-float group">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent-cyan rounded-xl opacity-20 blur-lg group-hover:opacity-40 transition-opacity duration-500"></div>
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                  <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366F1" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                  <path d="M50 20 L80 35 L80 65 L50 80 L20 65 L20 35 Z" fill="none" stroke="url(#logoGradient)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse-slow" />
                  <circle cx="50" cy="50" r="12" fill="url(#logoGradient)" className="animate-pulse" />
                  <path d="M50 20 L50 35 M80 35 L65 42.5 M80 65 L65 57.5 M50 80 L50 65 M20 65 L35 57.5 M20 35 L35 42.5" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                </svg>
              </div>
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
