import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Award, Trophy, BookOpen, ShieldCheck } from "lucide-react";

/**
 * Cohesive navigation bar across the Soft Game Studio Examination Suite.
 * Connects Live Competitions, Results Leaderboard, Certificate Verification, and Regulations.
 */
const ExamPanelNav = ({ activeTab }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const tabs = [
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
    <div className="w-full bg-slate-900 border-b border-slate-800 text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between py-3 gap-3">
          {/* Section Breadcrumb / Brand indicator */}
          <div className="flex items-center gap-2.5 text-xs text-slate-400">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/20">
              SGS
            </span>
            <span className="font-semibold text-slate-200 tracking-wide">
              Examination & Certification Suite
            </span>
            <span className="text-slate-600 hidden md:inline">|</span>
            <span className="hidden md:inline text-slate-400">
              Proctored Evaluations
            </span>
          </div>

          {/* Navigation Tabs */}
          <nav
            aria-label="Exam Panel Views"
            className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/70 border border-slate-800/80 shadow-inner overflow-x-auto max-w-full"
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
                      ? "bg-slate-800 text-emerald-400 shadow-sm border border-slate-700/60 font-semibold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      tab.isActive ? "text-emerald-400" : "text-slate-400"
                    }`}
                  />
                  <span>{tab.label}</span>
                </Link>
              );
            })}

            <div className="h-4 w-px bg-slate-800 mx-1 hidden sm:block" />

            <Link
              to="/About-Exam"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 rounded-lg transition-colors"
              title="Read Examination Rules & Anti-Cheat Protocols"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>Rules</span>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default ExamPanelNav;
