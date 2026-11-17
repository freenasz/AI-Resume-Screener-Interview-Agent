import React from "react";
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  ArrowRight, 
  Target, 
  BarChart3, 
  UserCheck,
  ShieldAlert,
  Sparkles
} from "lucide-react";
import { CandidateSession } from "../../types";

interface OverviewTabProps {
  session: CandidateSession;
  onNavigateTab: (tab: "questions" | "live_interview" | "report") => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ session, onNavigateTab }) => {
  const gap = session.gapAnalysis;
  const matchScore = gap?.matchScore || 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600 stroke-emerald-600";
    if (score >= 65) return "text-indigo-600 stroke-indigo-600";
    if (score >= 50) return "text-amber-600 stroke-amber-600";
    return "text-rose-600 stroke-rose-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (score >= 65) return "bg-indigo-50 text-indigo-700 border-indigo-200";
    if (score >= 50) return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-rose-50 text-rose-700 border-rose-200";
  };

  return (
    <div className="space-y-6">
      {/* Top Match Score & Seniority Fit Card */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Match Circle */}
        <div className="flex items-center gap-5 md:border-r border-[#E5E7EB] pr-4">
          <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-100"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`${getScoreColor(matchScore)} transition-all duration-1000 ease-out`}
                strokeDasharray={`${matchScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-black text-[#111827] tracking-tight">{matchScore}%</span>
              <span className="text-[10px] uppercase font-bold text-gray-400">Match</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getScoreBg(matchScore)}`}>
              {matchScore >= 80 ? "High Compatibility" : matchScore >= 65 ? "Moderate Alignment" : "Partial Fit"}
            </span>
            <h3 className="text-sm font-bold text-[#111827]">Overall Match Evaluation</h3>
            <p className="text-xs text-gray-500 line-clamp-2">
              {gap?.matchSummary || "AI has evaluated requirements and qualifications."}
            </p>
          </div>
        </div>

        {/* Fit Analysis Subscores */}
        <div className="space-y-2.5 md:border-r border-[#E5E7EB] pr-4">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
            <span>Technical Requirements</span>
            <span className="font-bold text-[#111827]">{gap?.fitAnalysis?.technicalScore || 80}%</span>
          </div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
              style={{ width: `${gap?.fitAnalysis?.technicalScore || 80}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
            <span>Experience & Seniority</span>
            <span className="font-bold text-[#111827]">{gap?.fitAnalysis?.experienceScore || 85}%</span>
          </div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
              style={{ width: `${gap?.fitAnalysis?.experienceScore || 85}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
            <span>Domain & Specialization</span>
            <span className="font-bold text-[#111827]">{gap?.fitAnalysis?.domainScore || 75}%</span>
          </div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 h-full rounded-full transition-all duration-500" 
              style={{ width: `${gap?.fitAnalysis?.domainScore || 75}%` }}
            />
          </div>
        </div>

        {/* Next Step Call to Action */}
        <div className="space-y-2.5 flex flex-col justify-center">
          <div className="text-xs text-gray-500">
            <span className="font-semibold text-gray-700">{session.tailoredQuestions.length} Personalized Questions</span> generated to probe specific gaps & claims.
          </div>
          <button
            onClick={() => onNavigateTab("live_interview")}
            className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all flex items-center justify-center gap-2"
          >
            Launch Live Interview
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigateTab("questions")}
            className="w-full py-2 px-4 rounded-lg text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors text-center"
          >
            Review Interview Questions
          </button>
        </div>
      </div>

      {/* Strengths and Gaps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#111827]">Key Strengths & Alignment</h3>
              <p className="text-xs text-gray-500">Demonstrated qualifications verified from resume</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {(gap?.keyStrengths || []).map((strength, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs text-emerald-950 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{strength}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gaps / Missing Skills */}
        <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#111827]">Skill Gaps & Missing Requisites</h3>
              <p className="text-xs text-gray-500">Required by job spec but unverified or absent</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {(gap?.gapsOrMissingSkills || []).map((gapItem, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-amber-50/50 border border-amber-100 text-xs text-amber-950 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{gapItem}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vague or Unverifiable Claims to Probe */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#111827]">Unverifiable or Vague Claims to Probe</h3>
            <p className="text-xs text-gray-500">High-impact claims on resume that warrant deeper technical verification during the interview</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(gap?.unverifiableOrVagueClaims || []).map((probe, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-2">
              <div className="text-xs font-semibold text-[#111827] bg-white p-2.5 rounded-lg border border-[#E5E7EB] italic text-gray-700">
                "{probe.claim}"
              </div>
              <div className="text-xs text-amber-800 flex items-start gap-1.5 pt-1">
                <span className="font-bold text-amber-700 flex-shrink-0">Risk / Concern:</span>
                <span>{probe.concern}</span>
              </div>
              <div className="text-xs text-indigo-900 bg-indigo-50/70 p-2.5 rounded-lg border border-indigo-100 flex items-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-indigo-800">Suggested Probe: </span>
                  <span>{probe.suggestedProbe}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
