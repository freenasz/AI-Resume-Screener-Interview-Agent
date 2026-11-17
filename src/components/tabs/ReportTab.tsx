import React from "react";
import { 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Quote, 
  Download, 
  Printer, 
  Share2, 
  Sparkles, 
  UserCheck, 
  TrendingUp, 
  ShieldAlert,
  ChevronDown,
  BarChart3,
  Calendar
} from "lucide-react";
import { CandidateSession, RecommendationType } from "../../types";

interface ReportTabProps {
  session: CandidateSession;
  onRegenerateReport: () => Promise<void>;
  isRegenerating: boolean;
}

export const ReportTab: React.FC<ReportTabProps> = ({
  session,
  onRegenerateReport,
  isRegenerating
}) => {
  const report = session.report;

  if (!report) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-[#E5E7EB] shadow-sm space-y-4">
        <Award className="w-12 h-12 text-gray-300 mx-auto" />
        <h3 className="text-base font-bold text-[#111827]">No Interview Report Generated Yet</h3>
        <p className="text-xs text-gray-500 max-w-md mx-auto">
          Conduct a live interview session with {session.candidateName} and click "End & Generate Report" to synthesize an objective hiring evaluation.
        </p>
        <button
          onClick={onRegenerateReport}
          disabled={isRegenerating}
          className="px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
        >
          {isRegenerating ? "Synthesizing Report..." : "Generate Report from Transcript Now"}
        </button>
      </div>
    );
  }

  const getRecommendationBadge = (rec: RecommendationType) => {
    switch (rec) {
      case "strong_hire":
        return {
          title: "STRONG HIRE",
          desc: "Candidate demonstrates exceptional technical mastery, structured communication, and clear resume verification.",
          bg: "bg-emerald-600 text-white",
          border: "border-emerald-500"
        };
      case "hire":
        return {
          title: "HIRE",
          desc: "Candidate meets or exceeds core position requirements with solid problem solving and domain grasp.",
          bg: "bg-emerald-700 text-white",
          border: "border-emerald-600"
        };
      case "potential_maybe":
        return {
          title: "POTENTIAL / MAYBE",
          desc: "Partial fit with noticeable skill gaps or shallow answers in key areas. Requires targeted second round.",
          bg: "bg-amber-600 text-white",
          border: "border-amber-500"
        };
      case "do_not_pass":
        return {
          title: "DO NOT PASS",
          desc: "Significant gaps in required competencies or unverifiable claims. Not recommended for this seniority level.",
          bg: "bg-rose-600 text-white",
          border: "border-rose-500"
        };
      default:
        return {
          title: "EVALUATION COMPLETE",
          desc: "Review scores below.",
          bg: "bg-gray-800 text-white",
          border: "border-gray-700"
        };
    }
  };

  const badgeInfo = getRecommendationBadge(report.overallRecommendation);

  const handlePrint = () => {
    window.print();
  };

  const handleExportMarkdown = () => {
    const md = `# Interview Summary Report: ${session.candidateName}
**Position**: ${session.jobTitle}
**Date**: ${new Date(report.completedAt).toLocaleDateString()}
**Recommendation**: ${badgeInfo.title}
**Overall Score**: ${report.overallScore}/100

## Executive Summary
${report.recommendationSummary}

## Competency Breakdown
- **Technical Proficiency**: ${report.competencyScores.technicalProficiency.score}/100 — ${report.competencyScores.technicalProficiency.notes}
- **Communication & Clarity**: ${report.competencyScores.communicationAndClarity.score}/100 — ${report.competencyScores.communicationAndClarity.notes}
- **Problem Solving**: ${report.competencyScores.problemSolving.score}/100 — ${report.competencyScores.problemSolving.notes}
- **Culture & Role Fit**: ${report.competencyScores.cultureAndRoleFit.score}/100 — ${report.competencyScores.cultureAndRoleFit.notes}
- **Experience Verification**: ${report.competencyScores.experienceVerification.score}/100 — ${report.competencyScores.experienceVerification.notes}

## Notable Quotes
${report.notableQuotes.map((q) => `> "${q.quote}"\n*Context: ${q.context}*\n`).join("\n")}

## Identified Red Flags & Risks
${report.redFlags.map((r) => `- ${r}`).join("\n")}

## Next Steps
${report.nextStepsRecommendation}
`;
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `interview-report-${session.candidateName.toLowerCase().replace(/\s+/g, "-")}.md`;
    a.click();
  };

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[#111827]">Executive Interview Summary Report</h3>
            <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(report.completedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Synthesized by AI Evaluation Agent based on live transcript, resume verification, and rubric criteria.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportMarkdown}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-gray-700 bg-white hover:bg-gray-100 border border-[#E5E7EB] transition-all flex items-center gap-1.5"
            id="export-md-report-btn"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            Export Markdown
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-gray-700 bg-white hover:bg-gray-100 border border-[#E5E7EB] transition-all flex items-center gap-1.5"
            id="print-report-btn"
          >
            <Printer className="w-3.5 h-3.5 text-gray-500" />
            Print / PDF
          </button>
        </div>
      </div>

      {/* Main Recommendation Hero Banner */}
      <div className={`rounded-2xl p-6 sm:p-8 ${badgeInfo.bg} shadow-sm space-y-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/20 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-white/80 block mb-1">
              Official Hiring Committee Recommendation
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{badgeInfo.title}</h2>
          </div>

          <div className="bg-white/15 backdrop-blur-md rounded-xl p-3 sm:px-6 text-center border border-white/20 self-start sm:self-auto">
            <span className="text-[10px] uppercase font-bold text-white/80 block">Overall Score</span>
            <span className="text-3xl font-bold">{report.overallScore}/100</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium">
          {report.recommendationSummary}
        </p>
      </div>

      {/* 5 Core Competencies Scorecards */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-indigo-600" />
          Competency Dimension Rubric
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. Technical */}
          <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#111827]">Technical Proficiency</span>
              <span className="text-sm font-bold text-indigo-600">
                {report.competencyScores.technicalProficiency.score}%
              </span>
            </div>
            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${report.competencyScores.technicalProficiency.score}%` }} />
            </div>
            <p className="text-xs text-gray-600 leading-relaxed pt-1">
              {report.competencyScores.technicalProficiency.notes}
            </p>
          </div>

          {/* 2. Communication */}
          <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#111827]">Communication & Clarity</span>
              <span className="text-sm font-bold text-emerald-600">
                {report.competencyScores.communicationAndClarity.score}%
              </span>
            </div>
            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${report.competencyScores.communicationAndClarity.score}%` }} />
            </div>
            <p className="text-xs text-gray-600 leading-relaxed pt-1">
              {report.competencyScores.communicationAndClarity.notes}
            </p>
          </div>

          {/* 3. Problem Solving */}
          <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#111827]">Problem Solving & Agility</span>
              <span className="text-sm font-bold text-blue-600">
                {report.competencyScores.problemSolving.score}%
              </span>
            </div>
            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: `${report.competencyScores.problemSolving.score}%` }} />
            </div>
            <p className="text-xs text-gray-600 leading-relaxed pt-1">
              {report.competencyScores.problemSolving.notes}
            </p>
          </div>

          {/* 4. Culture & Role Fit */}
          <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#111827]">Culture & Seniority Fit</span>
              <span className="text-sm font-bold text-purple-600">
                {report.competencyScores.cultureAndRoleFit.score}%
              </span>
            </div>
            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-purple-600 h-full rounded-full" style={{ width: `${report.competencyScores.cultureAndRoleFit.score}%` }} />
            </div>
            <p className="text-xs text-gray-600 leading-relaxed pt-1">
              {report.competencyScores.cultureAndRoleFit.notes}
            </p>
          </div>

          {/* 5. Experience Verification */}
          <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-2 lg:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#111827]">Resume Claim Verification</span>
              <span className="text-sm font-bold text-teal-600">
                {report.competencyScores.experienceVerification.score}%
              </span>
            </div>
            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-teal-600 h-full rounded-full" style={{ width: `${report.competencyScores.experienceVerification.score}%` }} />
            </div>
            <p className="text-xs text-gray-600 leading-relaxed pt-1">
              {report.competencyScores.experienceVerification.notes}
            </p>
          </div>
        </div>
      </div>

      {/* Per-Question Evaluation Breakdown */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-indigo-600" />
          Per-Question Performance & Evidence
        </h4>

        <div className="space-y-3">
          {(report.perQuestionEvaluation || []).map((qEval, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-2.5">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <span className="text-xs font-bold text-[#111827]">
                  Q{idx + 1}: {qEval.questionText}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase ${
                    qEval.verdict === "strong" ? "bg-emerald-100 text-emerald-800" :
                    qEval.verdict === "acceptable" ? "bg-blue-100 text-blue-800" :
                    "bg-rose-100 text-rose-800"
                  }`}>
                    {qEval.verdict} ({qEval.score}/10)
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-600 bg-white p-3 rounded-lg border border-[#E5E7EB] leading-relaxed">
                <strong className="text-[#111827] font-semibold">Answer Summary: </strong>
                {qEval.candidateAnswerSummary}
              </p>

              {(qEval.strengthsObserved || qEval.concernsIdentified) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                  {qEval.strengthsObserved && qEval.strengthsObserved.length > 0 && (
                    <div className="text-emerald-800 bg-emerald-50/60 p-2 rounded-lg border border-emerald-100">
                      <strong>Positive Signals: </strong>
                      {qEval.strengthsObserved.join("; ")}
                    </div>
                  )}
                  {qEval.concernsIdentified && qEval.concernsIdentified.length > 0 && (
                    <div className="text-amber-800 bg-amber-50/60 p-2 rounded-lg border border-amber-100">
                      <strong>Identified Gaps: </strong>
                      {qEval.concernsIdentified.join("; ")}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Notable Quotes & Red Flags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notable Quotes */}
        <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
            <Quote className="w-4 h-4 text-indigo-600" />
            Notable Quotes & Highlights
          </h4>

          <div className="space-y-3">
            {(report.notableQuotes || []).map((q, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-1.5">
                <p className="text-xs italic font-medium text-[#111827]">"{q.quote}"</p>
                <p className="text-[11px] text-gray-500">Context: {q.context}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Red Flags & Risks */}
        <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            Red Flags & Areas of Risk
          </h4>

          <div className="space-y-2.5">
            {(report.redFlags || []).length === 0 ? (
              <p className="text-xs text-gray-500 italic p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">No major red flags identified during the session.</p>
            ) : (
              report.redFlags.map((flag, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-rose-50/60 border border-rose-100 text-xs text-rose-900 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <span>{flag}</span>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 border-t border-[#E5E7EB] space-y-1.5">
            <h5 className="text-xs font-bold text-[#111827]">Actionable Next Steps</h5>
            <p className="text-xs text-indigo-950 leading-relaxed bg-indigo-50/40 p-3 rounded-xl border border-indigo-100">
              {report.nextStepsRecommendation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
