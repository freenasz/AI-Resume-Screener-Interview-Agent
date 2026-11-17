import React, { useState, useEffect, useRef } from "react";
import { 
  Send, 
  Sparkles, 
  User, 
  CheckCircle2, 
  Clock, 
  Loader2, 
  Briefcase,
  ShieldCheck,
  Award
} from "lucide-react";
import { CandidateSession } from "../types";

interface CandidatePortalStandaloneProps {
  session: CandidateSession;
  onSendMessage: (text: string) => Promise<void>;
  isAiResponding: boolean;
  onBackToRecruiter?: () => void;
}

export const CandidatePortalStandalone: React.FC<CandidatePortalStandaloneProps> = ({
  session,
  onSendMessage,
  isAiResponding,
  onBackToRecruiter
}) => {
  const [inputText, setInputText] = useState("");
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session.transcript, isAiResponding]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isAiResponding) return;
    const text = inputText.trim();
    setInputText("");
    await onSendMessage(text);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] flex flex-col font-sans">
      {/* Top Candidate Portal Header */}
      <header className="border-b border-[#E5E7EB] bg-white sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#111827] text-base">TalentAI Interview Room</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Live Session
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Candidate: <strong className="text-[#111827]">{session.candidateName}</strong> • Role: <strong className="text-[#111827]">{session.jobTitle}</strong>
              </p>
            </div>
          </div>

          {onBackToRecruiter && (
            <button
              onClick={onBackToRecruiter}
              className="text-xs text-gray-600 hover:text-[#111827] px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white transition-colors"
            >
              Switch to Recruiter Dashboard
            </button>
          )}
        </div>
      </header>

      {/* Main Conversation Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 flex flex-col">
        {/* Welcome Card banner */}
        <div className="mb-4 p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="space-y-1 text-xs">
            <h4 className="font-bold text-[#111827]">Welcome to your synchronous technical interview</h4>
            <p className="text-gray-500 leading-relaxed">
              Take your time to answer clearly. You can explain your architectural choices, metrics, and problem-solving methodology in your own words.
            </p>
          </div>
        </div>

        {/* Chat History Panel */}
        <div className="flex-1 bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-6 overflow-y-auto space-y-4 shadow-sm min-h-[480px]">
          {session.transcript.map((msg) => {
            const isCandidate = msg.sender === "candidate";
            const isAi = msg.sender === "ai";
            const isSystem = msg.sender === "system";

            if (isSystem) return null; // Keep system recruiter notes hidden from candidate

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isCandidate ? "items-end" : "items-start"} space-y-1.5`}
              >
                <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium px-1">
                  {isAi ? (
                    <span className="font-bold text-indigo-600 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      AI Interviewer
                    </span>
                  ) : (
                    <span className="font-bold text-gray-700 flex items-center gap-1">
                      <User className="w-3 h-3" />
                      You ({session.candidateName})
                    </span>
                  )}
                  <span>•</span>
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[90%] sm:max-w-[80%] shadow-sm ${
                    isCandidate
                      ? "bg-indigo-600 text-white rounded-tr-sm"
                      : "bg-[#F9FAFB] text-[#111827] border border-[#E5E7EB] rounded-tl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}

          {isAiResponding && (
            <div className="flex items-center gap-2.5 text-xs text-indigo-700 bg-indigo-50/50 border border-indigo-100 p-3 rounded-xl w-fit animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <span>AI Interviewer is reviewing your answer...</span>
            </div>
          )}

          <div ref={transcriptEndRef} />
        </div>

        {/* Input Bar */}
        <div className="mt-4">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Type your response to the interviewer..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isAiResponding}
              className="flex-1 px-4 py-3 rounded-xl text-xs sm:text-sm bg-white border border-[#E5E7EB] text-[#111827] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
              id="candidate-portal-input"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isAiResponding}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all disabled:opacity-50 flex items-center gap-1.5"
              id="candidate-portal-send-btn"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <p className="text-[11px] text-gray-500 mt-2 text-center">
            Your live answers are evaluated synchronously by the AI Interview Agent and recorded in your candidate session.
          </p>
        </div>
      </main>
    </div>
  );
};
