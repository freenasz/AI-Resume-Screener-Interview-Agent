import React, { useState, useEffect, useRef } from "react";
import { 
  Send, 
  Sparkles, 
  User, 
  ShieldCheck, 
  AlertCircle, 
  Flag, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Loader2, 
  ExternalLink, 
  Copy, 
  Check, 
  Award,
  Eye,
  MessageSquare,
  Bookmark,
  FileCheck,
  Radio,
  Share2
} from "lucide-react";
import { CandidateSession, InterviewMessage, MessageFlag } from "../../types";

interface LiveInterviewTabProps {
  session: CandidateSession;
  onSendMessage: (text: string, sender: "candidate" | "recruiter") => Promise<void>;
  onInjectQuestion: (questionText: string) => Promise<void>;
  onFlagMessage: (messageId: string, flagType: "strength" | "concern" | "followup_needed" | "star_answer", note: string) => Promise<void>;
  onSaveNotes: (notes: string) => Promise<void>;
  onGenerateReport: () => Promise<void>;
  isAiResponding: boolean;
  isGeneratingReport: boolean;
}

export const LiveInterviewTab: React.FC<LiveInterviewTabProps> = ({
  session,
  onSendMessage,
  onInjectQuestion,
  onFlagMessage,
  onSaveNotes,
  onGenerateReport,
  isAiResponding,
  isGeneratingReport
}) => {
  // Mode: Recruiter Monitor vs Candidate Simulator View
  const [viewRole, setViewRole] = useState<"recruiter" | "candidate">("recruiter");
  
  // Input states
  const [candidateInput, setCandidateInput] = useState("");
  const [injectedQuestionText, setInjectedQuestionText] = useState("");
  const [showInjectModal, setShowInjectModal] = useState(false);
  const [recruiterNotes, setRecruiterNotes] = useState(session.recruiterNotes || "");
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  
  // Flag modal state
  const [flaggingMessageId, setFlaggingMessageId] = useState<string | null>(null);
  const [flagType, setFlagType] = useState<"strength" | "concern" | "followup_needed" | "star_answer">("strength");
  const [flagNote, setFlagNote] = useState("");

  // Share link copy state
  const [copiedLink, setCopiedLink] = useState(false);

  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session.transcript, isAiResponding]);

  const handleCandidateSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateInput.trim() || isAiResponding) return;
    const text = candidateInput.trim();
    setCandidateInput("");
    await onSendMessage(text, "candidate");
  };

  const handleInjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!injectedQuestionText.trim()) return;
    await onInjectQuestion(injectedQuestionText.trim());
    setInjectedQuestionText("");
    setShowInjectModal(false);
  };

  const handleFlagSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flaggingMessageId) return;
    await onFlagMessage(flaggingMessageId, flagType, flagNote);
    setFlaggingMessageId(null);
    setFlagNote("");
  };

  const handleNotesBlur = async () => {
    if (recruiterNotes !== session.recruiterNotes) {
      setIsSavingNotes(true);
      await onSaveNotes(recruiterNotes);
      setIsSavingNotes(false);
    }
  };

  const handleCopyCandidateLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?candidate=${session.id}&mode=candidate`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const activeQ = session.tailoredQuestions[session.activeQuestionIndex];
  const totalQuestions = session.tailoredQuestions.length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Mode Switcher */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5E7EB] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Session Status & Active Question */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Synchronous Live Session
            </span>
            <span className="text-xs text-gray-500 font-medium">
              Progress: <strong className="text-[#111827]">{session.activeQuestionIndex + 1} of {totalQuestions}</strong> questions
            </span>
          </div>
          <p className="text-xs text-gray-600 font-medium line-clamp-1">
            Current Target: <span className="text-indigo-600 font-semibold">{activeQ?.targetCompetency || "Interview in Progress"}</span>
          </p>
        </div>

        {/* Right: Actions & View Switcher */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Recruiter vs Candidate Mode Switcher */}
          <div className="bg-gray-100 p-1 rounded-lg flex items-center text-xs font-semibold">
            <button
              onClick={() => setViewRole("recruiter")}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                viewRole === "recruiter"
                  ? "bg-white text-indigo-700 shadow-sm font-bold"
                  : "text-gray-600 hover:text-[#111827]"
              }`}
              id="role-recruiter-btn"
            >
              <Eye className="w-3.5 h-3.5" />
              Recruiter Live Monitor
            </button>
            <button
              onClick={() => setViewRole("candidate")}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                viewRole === "candidate"
                  ? "bg-white text-indigo-700 shadow-sm font-bold"
                  : "text-gray-600 hover:text-[#111827]"
              }`}
              id="role-candidate-btn"
            >
              <User className="w-3.5 h-3.5" />
              Candidate Chat View
            </button>
          </div>

          <button
            onClick={handleCopyCandidateLink}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 bg-white hover:bg-gray-100 border border-[#E5E7EB] transition-all flex items-center gap-1.5"
            title="Copy standalone candidate interview link"
            id="copy-candidate-link-btn"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-gray-500" />}
            {copiedLink ? "Link Copied!" : "Candidate Link"}
          </button>

          <button
            onClick={onGenerateReport}
            disabled={isGeneratingReport}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
            id="finish-generate-report-btn"
          >
            {isGeneratingReport ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Scoring...
              </>
            ) : (
              <>
                <Award className="w-3.5 h-3.5" />
                End & Generate Report
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Chat / Live Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left / Center (8 cols): Real-Time Transcript */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col h-[650px] overflow-hidden">
          
          {/* Transcript Header */}
          <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-[#111827]">
                {viewRole === "recruiter" ? "Live Recruiter Surveillance Feed" : `Candidate Room: ${session.candidateName}`}
              </span>
            </div>

            {viewRole === "recruiter" && (
              <button
                onClick={() => setShowInjectModal(true)}
                className="px-3 py-1 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors flex items-center gap-1"
                id="inject-question-trigger-btn"
              >
                <Plus className="w-3.5 h-3.5" />
                Inject Question
              </button>
            )}
          </div>

          {/* Transcript Scroll Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-gray-50/30">
            {session.transcript.map((msg) => {
              const isAi = msg.sender === "ai";
              const isSystem = msg.sender === "system";
              const isCandidate = msg.sender === "candidate";

              if (isSystem) {
                return (
                  <div key={msg.id} className="flex justify-center my-2">
                    <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                      {msg.content}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isCandidate ? "items-end" : "items-start"} space-y-1.5`}
                >
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium px-1">
                    {isAi ? (
                      <span className="font-bold text-indigo-600 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        AI Interviewer
                      </span>
                    ) : (
                      <span className="font-bold text-gray-700 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {session.candidateName}
                      </span>
                    )}
                    <span>•</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>

                    {msg.isFollowUp && (
                      <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.2 rounded font-semibold">
                        Adaptive Follow-Up
                      </span>
                    )}
                    {msg.isRecruiterInjected && (
                      <span className="text-[10px] bg-indigo-50 text-indigo-800 border border-indigo-200 px-1.5 py-0.2 rounded font-semibold">
                        Recruiter Prompt
                      </span>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className="relative group max-w-[88%] sm:max-w-[80%]">
                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                        isCandidate
                          ? "bg-indigo-600 text-white rounded-tr-none"
                          : "bg-white border border-[#E5E7EB] text-[#111827] rounded-tl-none"
                      }`}
                    >
                      {msg.content}
                    </div>

                    {/* Recruiter Flag Actions */}
                    {viewRole === "recruiter" && isCandidate && (
                      <button
                        onClick={() => setFlaggingMessageId(msg.id)}
                        className="absolute -left-8 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-white border border-[#E5E7EB] text-gray-400 hover:text-amber-600 hover:border-amber-300 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Flag / Bookmark this answer"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Message Flags List (if any) */}
                  {msg.recruiterFlags && msg.recruiterFlags.length > 0 && (
                    <div className="flex flex-wrap gap-1 px-1 pt-0.5">
                      {msg.recruiterFlags.map((flag, fIdx) => (
                        <span
                          key={fIdx}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200"
                        >
                          <Flag className="w-2.5 h-2.5 text-amber-600" />
                          <span className="capitalize">{flag.flag.replace("_", " ")}</span>
                          {flag.note && <span>: {flag.note}</span>}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* AI Typing indicator */}
            {isAiResponding && (
              <div className="flex items-start gap-2 text-xs text-indigo-600 bg-white border border-indigo-100 p-3 rounded-xl w-fit animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AI Interviewer is evaluating response and framing next question...</span>
              </div>
            )}

            <div ref={transcriptEndRef} />
          </div>

          {/* Input Area (Candidate response simulator or live prompt) */}
          <div className="p-4 border-t border-[#E5E7EB] bg-white">
            <form onSubmit={handleCandidateSend} className="flex items-center gap-2">
              <input
                type="text"
                placeholder={
                  viewRole === "candidate"
                    ? "Type your answer to the AI interviewer..."
                    : `Simulate candidate (${session.candidateName}) response...`
                }
                value={candidateInput}
                onChange={(e) => setCandidateInput(e.target.value)}
                disabled={isAiResponding}
                className="flex-1 px-4 py-2.5 rounded-lg text-xs sm:text-sm border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                id="interview-chat-input"
              />
              <button
                type="submit"
                disabled={!candidateInput.trim() || isAiResponding}
                className="px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all disabled:opacity-50 flex items-center gap-1.5"
                id="send-chat-msg-btn"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Right (4 cols): Recruiter Observation & Curriculum Deck */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Target Question Guide Card */}
          <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Current Question Tracker
              </h4>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                Q{session.activeQuestionIndex + 1} of {totalQuestions}
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-[#111827]">{activeQ?.targetCompetency || "Technical Evaluation"}</p>
              <p className="text-xs text-gray-600 italic bg-[#F9FAFB] p-3 rounded-xl border border-[#E5E7EB]">
                "{activeQ?.questionText}"
              </p>
            </div>

            {activeQ?.whatToLookFor && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-gray-700 block">Look for signals:</span>
                <ul className="space-y-1">
                  {activeQ.whatToLookFor.map((item, idx) => (
                    <li key={idx} className="text-xs text-gray-600 flex items-start gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Recruiter Live Private Notes */}
          <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
                Recruiter Private Notes
              </h4>
              {isSavingNotes && <span className="text-[10px] text-gray-400">Saving...</span>}
            </div>

            <textarea
              rows={5}
              placeholder="Record real-time impressions, body language notes, or follow-up items..."
              value={recruiterNotes}
              onChange={(e) => setRecruiterNotes(e.target.value)}
              onBlur={handleNotesBlur}
              className="w-full p-3 text-xs rounded-lg border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-[#111827]"
            />
            <p className="text-[11px] text-gray-400">Notes automatically sync and factor into the Final Summary Report.</p>
          </div>

          {/* Quick Question Inject Button */}
          <button
            onClick={() => setShowInjectModal(true)}
            className="w-full py-2.5 px-4 rounded-lg text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Inject Custom Question Mid-Session
          </button>
        </div>
      </div>

      {/* Recruiter Inject Question Modal */}
      {showInjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <form
            onSubmit={handleInjectSubmit}
            className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in"
          >
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Inject Question to AI Interviewer
            </h3>
            <p className="text-xs text-slate-500">
              The AI agent will prioritize asking this question on the next conversational turn.
            </p>

            <textarea
              rows={3}
              placeholder="e.g. Can you explain why you chose PostgreSQL over DynamoDB for the analytics dashboard?"
              value={injectedQuestionText}
              onChange={(e) => setInjectedQuestionText(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
              required
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowInjectModal(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Queue Question
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Flag Message Modal */}
      {flaggingMessageId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <form
            onSubmit={handleFlagSubmit}
            className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in"
          >
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-600" />
              Flag Candidate Response
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Flag Tag</label>
              <select
                value={flagType}
                onChange={(e) => setFlagType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
              >
                <option value="strength">Key Strength / Impressive Signal</option>
                <option value="concern">Concern / Unsubstantiated Claim</option>
                <option value="star_answer">Exemplary STAR Answer</option>
                <option value="followup_needed">Follow-up Needed Later</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Recruiter Tag Note</label>
              <input
                type="text"
                placeholder="e.g. Demonstrated thorough grasp of distributed locks"
                value={flagNote}
                onChange={(e) => setFlagNote(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setFlaggingMessageId(null)}
                className="px-3.5 py-1.5 text-xs text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl"
              >
                Save Flag
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
