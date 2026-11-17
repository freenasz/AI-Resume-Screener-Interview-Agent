import React from "react";
import { Sparkles, Users, Plus, ShieldCheck, Video, RefreshCw } from "lucide-react";

interface NavbarProps {
  activeView: "dashboard" | "detail" | "candidate_standalone";
  onNavigateHome: () => void;
  onOpenNewScreening: () => void;
  selectedCandidateName?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onNavigateHome,
  onOpenNewScreening,
  selectedCandidateName,
  onRefresh,
  isRefreshing
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-[#E5E7EB] bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
            id="nav-home-btn"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:bg-indigo-700 transition-colors">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#111827] tracking-tight text-base">TalentAI</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  Screen & Interview Agent
                </span>
              </div>
              <p className="text-[11px] text-gray-500 hidden sm:block">AI Resume Analysis • Live Screening • Scored Evaluations</p>
            </div>
          </button>

          {activeView === "detail" && selectedCandidateName && (
            <div className="hidden md:flex items-center text-xs font-medium text-gray-400 pl-3 border-l border-gray-200">
              <span className="text-gray-500 mr-2">Candidate:</span>
              <span className="text-[#111827] font-semibold">{selectedCandidateName}</span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {activeView === "detail" && (
            <button
              onClick={onNavigateHome}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-gray-700 hover:text-[#111827] hover:bg-gray-100 border border-[#E5E7EB] transition-colors flex items-center gap-1.5"
              id="back-to-candidates-btn"
            >
              <Users className="w-3.5 h-3.5 text-gray-500" />
              All Candidates
            </button>
          )}

          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-lg text-gray-600 hover:text-[#111827] hover:bg-gray-100 border border-[#E5E7EB] transition-all disabled:opacity-50"
              title="Refresh data"
              id="refresh-btn"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-indigo-600" : ""}`} />
            </button>
          )}

          <button
            onClick={onOpenNewScreening}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all active:scale-95"
            id="start-new-screening-btn"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">New Screening</span>
          </button>
        </div>
      </div>
    </header>
  );
};
