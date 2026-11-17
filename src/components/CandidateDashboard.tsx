import React, { useState } from "react";
import { 
  Users, 
  Search, 
  Plus, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight, 
  FileText, 
  MessageSquare, 
  Sparkles, 
  Award, 
  AlertCircle,
  ExternalLink,
  Trash2,
  Filter
} from "lucide-react";
import { SessionSummary, RecommendationType } from "../types";

interface CandidateDashboardProps {
  sessions: SessionSummary[];
  onSelectCandidate: (id: string, initialTab?: string) => void;
  onOpenNewScreening: () => void;
  onDeleteSession: (id: string) => void;
  onSelectPreset: (presetIndex: number) => void;
}

export const CandidateDashboard: React.FC<CandidateDashboardProps> = ({
  sessions,
  onSelectCandidate,
  onOpenNewScreening,
  onDeleteSession,
  onSelectPreset,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch =
      s.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (statusFilter === "all") return true;
    if (statusFilter === "completed") return s.status === "completed";
    if (statusFilter === "interview") return s.status === "in_interview" || s.status === "ready_for_interview";
    if (statusFilter === "strong_hire") return s.recommendation === "strong_hire" || s.recommendation === "hire";
    return true;
  });

  const totalCount = sessions.length;
  const completedCount = sessions.filter((s) => s.status === "completed").length;
  const inProgressCount = sessions.filter((s) => s.status === "in_interview" || s.status === "ready_for_interview").length;
  const avgMatchScore =
    totalCount > 0
      ? Math.round(sessions.reduce((acc, s) => acc + (s.matchScore || 0), 0) / totalCount)
      : 0;

  const getRecommendationBadge = (rec: RecommendationType | null) => {
    switch (rec) {
      case "strong_hire":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Award className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            Strong Hire
          </span>
        );
      case "hire":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            Hire
          </span>
        );
      case "potential_maybe":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5 mr-1 text-amber-600" />
            Potential / Maybe
          </span>
        );
      case "do_not_pass":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            Do Not Pass
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusPill = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            Completed
          </span>
        );
      case "in_interview":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            In Interview
          </span>
        );
      case "ready_for_interview":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/60">
            Ready to Interview
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            Screened
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner / Metrics */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            AI Screening & Interview Agent
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827]">
            Resume Screening & AI Interview Room
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            Extract candidate skills, generate tailored behavioral & technical questions, monitor synchronous live interviews, and inspect actionable hiring reports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenNewScreening}
            className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center gap-2"
            id="dashboard-new-candidate-btn"
          >
            <Plus className="w-4 h-4" />
            Screen New Resume
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E5E7EB] shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase tracking-wider">
            <span>Total Candidates</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-[#111827] mt-2">{totalCount}</p>
          <p className="text-xs text-gray-400 mt-1">Screened & processed</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E5E7EB] shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase tracking-wider">
            <span>Avg Match Score</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-[#111827] mt-2">{avgMatchScore}%</p>
          <p className="text-xs text-gray-400 mt-1">Resume vs Spec alignment</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E5E7EB] shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase tracking-wider">
            <span>Interviews Conducted</span>
            <MessageSquare className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-[#111827] mt-2">{completedCount}</p>
          <p className="text-xs text-gray-400 mt-1">{inProgressCount} active / queued</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E5E7EB] shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase tracking-wider">
            <span>Hiring Decisions Ready</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-[#111827] mt-2">{completedCount}</p>
          <p className="text-xs text-gray-400 mt-1">Detailed reports generated</p>
        </div>
      </div>

      {/* Instant Demo Presets Section */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#111827] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Instant 1-Click Demo Profiles
            </h2>
            <p className="text-xs text-gray-500">Test drive the complete screening, live chat interview, and report evaluation flow immediately</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <button
            onClick={() => onSelectPreset(0)}
            className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] hover:border-indigo-500 hover:bg-white hover:shadow-sm transition-all text-left group"
            id="preset-0-btn"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-[#111827] group-hover:text-indigo-600">Alex Rivera</span>
              <span className="text-xs font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">84% Match</span>
            </div>
            <p className="text-xs font-semibold text-gray-600 mt-1">Senior Full-Stack Engineer</p>
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">React, Node.js microservices with gap probe on Apache Kafka</p>
          </button>

          <button
            onClick={() => onSelectPreset(1)}
            className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] hover:border-indigo-500 hover:bg-white hover:shadow-sm transition-all text-left group"
            id="preset-1-btn"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-[#111827] group-hover:text-indigo-600">Maya Chen</span>
              <span className="text-xs font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded border border-indigo-200">Screen Now</span>
            </div>
            <p className="text-xs font-semibold text-gray-600 mt-1">Lead Product Manager</p>
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">B2B SaaS PLG funnels & Enterprise pricing tier experience</p>
          </button>

          <button
            onClick={() => onSelectPreset(2)}
            className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] hover:border-indigo-500 hover:bg-white hover:shadow-sm transition-all text-left group"
            id="preset-2-btn"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-[#111827] group-hover:text-indigo-600">Dr. Liam Vance</span>
              <span className="text-xs font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded border border-indigo-200">Screen Now</span>
            </div>
            <p className="text-xs font-semibold text-gray-600 mt-1">Senior AI / ML Platform Engineer</p>
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">vLLM, TensorRT-LLM, PyTorch & GPU latency optimization</p>
          </button>
        </div>
      </div>

      {/* Candidate List & Filters */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden">
        {/* Header Controls */}
        <div className="p-4 sm:p-5 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search candidate name or position..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg text-xs sm:text-sm border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
              id="search-candidates-input"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-semibold">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                statusFilter === "all"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All ({sessions.length})
            </button>
            <button
              onClick={() => setStatusFilter("interview")}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                statusFilter === "interview"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              In Interview ({inProgressCount})
            </button>
            <button
              onClick={() => setStatusFilter("completed")}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                statusFilter === "completed"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Completed ({completedCount})
            </button>
          </div>
        </div>

        {/* List Content */}
        {filteredSessions.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-[#111827]">No candidates found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
              {searchQuery ? "No candidate matches your search criteria." : "Start by screening your first candidate or test drive one of the preset profiles above."}
            </p>
            <button
              onClick={onOpenNewScreening}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Upload & Screen Candidate
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#E5E7EB]">
            {filteredSessions.map((candidate) => (
              <div
                key={candidate.id}
                className="p-4 sm:p-5 hover:bg-gray-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Left info */}
                <div className="space-y-1.5 flex-1 cursor-pointer" onClick={() => onSelectCandidate(candidate.id)}>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="font-bold text-[#111827] text-sm sm:text-base hover:text-indigo-600 transition-colors">
                      {candidate.candidateName}
                    </h3>
                    {getStatusPill(candidate.status)}
                    {candidate.recommendation && getRecommendationBadge(candidate.recommendation)}
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                    <span className="font-semibold text-gray-700">{candidate.jobTitle}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {new Date(candidate.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span>•</span>
                    <span>{candidate.totalQuestions} Tailored Questions</span>
                  </div>
                </div>

                {/* Right metrics & action buttons */}
                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="text-right pr-2">
                    <div className="text-[10px] uppercase font-bold text-gray-400">Match Score</div>
                    <div className="text-base font-bold text-[#111827]">
                      {candidate.matchScore}%
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onSelectCandidate(candidate.id, "overview")}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 bg-white hover:bg-gray-100 border border-[#E5E7EB] transition-all flex items-center gap-1"
                      title="View Screening Analysis"
                      id={`view-overview-${candidate.id}`}
                    >
                      <FileText className="w-3.5 h-3.5 text-gray-500" />
                      Overview
                    </button>

                    <button
                      onClick={() => onSelectCandidate(candidate.id, "live_interview")}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-all flex items-center gap-1"
                      title="Live Interview & Monitoring"
                      id={`open-interview-${candidate.id}`}
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                      Interview
                    </button>

                    {candidate.status === "completed" && (
                      <button
                        onClick={() => onSelectCandidate(candidate.id, "report")}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all flex items-center gap-1"
                        title="View Final Report"
                        id={`view-report-${candidate.id}`}
                      >
                        <Award className="w-3.5 h-3.5 text-emerald-600" />
                        Report
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete candidate session for ${candidate.candidateName}?`)) {
                          onDeleteSession(candidate.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Candidate"
                      id={`delete-cand-${candidate.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
