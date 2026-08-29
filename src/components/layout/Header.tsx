import React from "react";
import { Menu, Bell, Search } from "lucide-react";
import { useLocation } from "react-router-dom";

const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/question-bank": "Question Bank",
  "/add-question": "Add Question",
  "/create-quiz": "Create Quiz",
  "/quiz-history": "Quiz History",
  "/analytics": "Analytics",
  "/subjects": "Subjects",
};

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || "OwnUrGATE";

  return (
    <header className="h-14 border-b border-bg-border bg-bg-primary/80 backdrop-blur-md flex items-center px-4 gap-4 sticky top-0 z-20">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-all"
      >
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-2">
        <h1 className="text-text-primary font-semibold text-base">{title}</h1>
        <span className="hidden sm:block text-text-muted text-sm">— GATE CS 2025</span>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 bg-bg-secondary border border-bg-border rounded-lg px-3 py-1.5 text-text-muted text-sm w-44">
          <Search size={14} />
          <span className="text-xs">Quick search...</span>
        </div>
        <button className="relative p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-all">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-blue rounded-full" />
        </button>
      </div>
    </header>
  );
}
