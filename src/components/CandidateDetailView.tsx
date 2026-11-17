import React, { useState, useEffect } from "react";
import { 
  Users, 
  ArrowLeft, 
  FileText, 
  Briefcase, 
  MessageSquare, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  Share2, 
  Trash2,
  Layers,
  HelpCircle,
  Radio
} from "lucide-react";
import { CandidateSession, TailoredQuestion } from "../types";
import { OverviewTab } from "./tabs/OverviewTab";
import { ResumeSpecTab } from "./tabs/ResumeSpecTab";
import { QuestionsTab } from "./tabs/QuestionsTab";
import { LiveInterviewTab } from "./tabs/LiveInterviewTab";
import { ReportTab } from "./tabs/ReportTab";

interface CandidateDetailViewProps {
  session: CandidateSession;
  initialTab?: string;
  onBack: () => void;
  onUpdateSession: (updated: CandidateSession) => void;
  onSendMessage: (text: string, sender: "candidate" | "recruiter") => Promise<void>;
  onInjectQuestion: (questionText: string) => Promise<void>;
  onFlagMessage: (messageId: string, flagType: "strength" | "concern" | "followup_needed" | "star_answer", note: string) => Promise<void>;
  onSaveNotes: (notes: string) => Promise<void>;
  onGenerateReport: () => Promise<void>;
  onUpdateQuestions: (questions: TailoredQuestion[]) => Promise<void>;
  isAiResponding: boolean;
  isGeneratingReport: boolean;
}

export const CandidateDetailView: React.FC<CandidateDetailViewProps> = ({
  session,
  initialTab = "overview",
  onBack,
  onUpdateSession,
  onSendMessage,
  onInjectQuestion,
  onFlagMessage,
  onSaveNotes,
  onGenerateReport,
  onUpdateQuestions,
  isAiResponding,
  isGeneratingReport
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Synchronize with SSE events from server for live multi-window synchronization
  useEffect(() => {
    const eventSource = new EventSource(`/api/session/${session.id}/events`);

    eventSource.addEventListener("new_message", (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.message) {
          onUpdateSession({
            ...session,
            status: data.sessionStatus || session.status,
            activeQuestionIndex: data.activeQuestionIndex !== undefined ? data.activeQuestionIndex : session.activeQuestionIndex,
            transcript: session.transcript.some((m) => m.id === data.message.id)
              ? session.transcript
              : [...session.transcript, data.message],
          });
        }
      } catch (err) {
        console.error("SSE parse error:", err);
      }
    });

    eventSource.addEventListener("report_generated", (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.report) {
          onUpdateSession({
            ...session,
            status: "completed",
            report: data.report,
          });
        }
      } catch (err) {
        console.error("SSE report parse error:", err);
      }
    });

    return () => {
      eventSource.close();
    };
  }, [session.id]);

  const getStatusBadge = () => {
    switch (session.status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Interview Completed
          </span>
        );
      case "in_interview":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            Interview In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Ready for Interview
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Breadcrumb & Candidate Summary Card */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-[#111827] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Candidates Dashboard
          </button>
          
          <div className="flex items-center gap-2">
            {getStatusBadge()}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#111827] tracking-tight">{session.candidateName}</h1>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                {session.jobTitle}
              </span>
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-2">
              <span>Screened on {new Date(session.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span>{session.tailoredQuestions.length} Questions Generated</span>
              <span>•</span>
              <span>{session.transcript.length} Messages in Session</span>
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="text-right bg-[#F9FAFB] px-4 py-2 rounded-xl border border-[#E5E7EB]">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Match Score</div>
              <div className="text-xl font-bold text-[#111827]">{session.gapAnalysis?.matchScore || 0}%</div>
            </div>

            {session.report && (
              <div className="text-right bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
                <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Recommendation</div>
                <div className="text-xs font-bold text-emerald-900 uppercase">
                  {session.report.overallRecommendation.replace("_", " ")}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <div className="flex items-center gap-1 border-t border-[#E5E7EB] pt-4 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "overview"
                ? "bg-indigo-600 text-white font-bold"
                : "text-gray-600 hover:text-[#111827] hover:bg-gray-100"
            }`}
            id="tab-overview-btn"
          >
            <Layers className="w-4 h-4" />
            1. Overview & Gap Match
          </button>

          <button
            onClick={() => setActiveTab("resume")}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "resume"
                ? "bg-indigo-600 text-white font-bold"
                : "text-gray-600 hover:text-[#111827] hover:bg-gray-100"
            }`}
            id="tab-resume-btn"
          >
            <FileText className="w-4 h-4" />
            2. Resume & Job Spec
          </button>

          <button
            onClick={() => setActiveTab("questions")}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "questions"
                ? "bg-indigo-600 text-white font-bold"
                : "text-gray-600 hover:text-[#111827] hover:bg-gray-100"
            }`}
            id="tab-questions-btn"
          >
            <HelpCircle className="w-4 h-4" />
            3. Tailored Questions ({session.tailoredQuestions.length})
          </button>

          <button
            onClick={() => setActiveTab("live_interview")}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "live_interview"
                ? "bg-indigo-600 text-white font-bold"
                : "text-gray-600 hover:text-[#111827] hover:bg-gray-100"
            }`}
            id="tab-interview-btn"
          >
            <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
            4. Live Interview Room
          </button>

          <button
            onClick={() => setActiveTab("report")}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "report"
                ? "bg-indigo-600 text-white font-bold"
                : "text-gray-600 hover:text-[#111827] hover:bg-gray-100"
            }`}
            id="tab-report-btn"
          >
            <Award className="w-4 h-4" />
            5. Summary Report {session.report ? "✓" : ""}
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === "overview" && (
          <OverviewTab
            session={session}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === "resume" && (
          <ResumeSpecTab session={session} />
        )}

        {activeTab === "questions" && (
          <QuestionsTab
            session={session}
            onUpdateQuestions={onUpdateQuestions}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === "live_interview" && (
          <LiveInterviewTab
            session={session}
            onSendMessage={onSendMessage}
            onInjectQuestion={onInjectQuestion}
            onFlagMessage={onFlagMessage}
            onSaveNotes={onSaveNotes}
            onGenerateReport={onGenerateReport}
            isAiResponding={isAiResponding}
            isGeneratingReport={isGeneratingReport}
          />
        )}

        {activeTab === "report" && (
          <ReportTab
            session={session}
            onRegenerateReport={onGenerateReport}
            isRegenerating={isGeneratingReport}
          />
        )}
      </div>
    </div>
  );
};
