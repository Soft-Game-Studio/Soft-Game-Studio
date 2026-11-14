import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Award, Trophy, BookOpen, ShieldCheck, Home, MoreVertical, X } from "lucide-react";
import { useTheme } from "../../components/Theems/UseTheems";

/**
 * Cohesive navigation bar across the Soft Game Studio Examination Suite.
 * Fully responsive: horizontal tabs on desktop, 3-dot dropdown menu on mobile.
 */
const ExamPanelNav = ({ activeTab }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const currentPath = location.pathname;
  
  // State to manage mobile menu toggle
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const tabs = [
    {
      id: "home",
      label: "Home",
      path: "/",
      icon: Home,
      isActive: activeTab === "home" || currentPath === "/",
    },
    {
      id: "exams",
      label: "Competitions & Exams",
      path: "/Exam",
      icon: BookOpen,
      isActive: activeTab === "exams" || currentPath === "/Exam" || currentPath.startsWith("/ExamDetails"),
    },
    {
      id: "results",
      label: "Results & Leaderboard",
      path: "/Result",
      icon: Trophy,
      isActive: activeTab === "results" || currentPath === "/Result",
    },
    {
      id: "certificates",
      label: "Verify Certificates",
      path: "/Result/Certificates",
      icon: Award,
      isActive:
        activeTab === "certificates" ||
        currentPath.startsWith("/Result/Certificates") ||
        currentPath.startsWith("/Exam/Certificates") ||
        currentPath.startsWith("/SGSCERT"),
    },
  ];

  return (
    <div className="w-full bg-neutral-900 border-b border-neutral-800 text-neutral-200 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-8">
        <div className="flex items-center justify-between py-3 gap-3">
          
          {/* Section Breadcrumb / Brand indicator */}
          <div className="flex items-center gap-2.5 text-xs text-neutral-400">
            <span className="inline-flex items-center justify-center w-6 h-6 sm:w-5 sm:h-5 rounded-md bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/20 overflow-hidden shrink-0">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Assets%2FSqure%20Logo.png?alt=media"
                alt="Soft Game Studio logo"
                className="w-full h-full object-cover rounded-full"
              />
            </span>
            <span className="font-semibold text-neutral-200 tracking-wide truncate">
              Examination & Certification Suite
            </span>
            <span className="text-neutral-600 hidden md:inline">|</span>
            <span className="hidden md:inline text-neutral-400">
              Proctored Evaluations
            </span>
          </div>

          {/* Mobile 3-Dot Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="xl:hidden p-1.5 ml-auto rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Toggle Navigation Menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <MoreVertical className="w-5 h-5" />}
          </button>

          {/* Desktop Navigation Tabs */}
          <nav
            aria-label="Exam Panel Views"
            className="hidden xl:flex items-center gap-1.5 p-1 rounded-xl bg-neutral-950/70 border border-neutral-800/80 shadow-inner"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.id}
                  to={tab.path}
                  aria-current={tab.isActive ? "page" : undefined}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    tab.isActive
                      ? "bg-neutral-800 text-emerald-400 shadow-sm border border-neutral-700/60 font-semibold"
                      : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60"
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      tab.isActive ? "text-emerald-400" : "text-neutral-400"
                    }`}
                  />
                  <span>{tab.label}</span>
                </Link>
              );
            })}

            <div className="h-4 w-px bg-neutral-800 mx-1" />

            <Link
              to="/About-Exam"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60 rounded-lg transition-colors"
              title="Read Examination Rules & Anti-Cheat Protocols"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
              <span>Rules</span>
            </Link>
          </nav>
        </div>

        {/* Mobile Dropdown Navigation */}
        {isMenuOpen && (
          <nav className="xl:hidden pb-3 transition-all duration-200 ease-in-out">
            <div className="flex flex-col p-1.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80 shadow-inner">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Link
                    key={tab.id}
                    to={tab.path}
                    onClick={() => setIsMenuOpen(false)}
                    aria-current={tab.isActive ? "page" : undefined}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      tab.isActive
                        ? "bg-neutral-800 text-emerald-400 shadow-sm border border-neutral-700/60 font-semibold"
                        : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        tab.isActive ? "text-emerald-400" : "text-neutral-400"
                      }`}
                    />
                    <span>{tab.label}</span>
                  </Link>
                );
              })}
              
              <div className="h-px w-full bg-neutral-800 my-1.5" />
              
              <Link
                to="/About-Exam"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60 rounded-lg transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-neutral-400" />
                <span>Examination Rules</span>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </div>
  );
};

export default ExamPanelNav;
