import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Navbar } from "./components/Navbar";
import { CandidateDashboard } from "./components/CandidateDashboard";
import { CandidateDetailView } from "./components/CandidateDetailView";
import { NewScreeningModal } from "./components/NewScreeningModal";
import { CandidatePortalStandalone } from "./components/CandidatePortalStandalone";
import { CandidateSession, SessionSummary, TailoredQuestion } from "./types";
import { PRESETS } from "./data/presets";

export default function App() {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [activeSession, setActiveSession] = useState<CandidateSession | null>(null);
  const [activeView, setActiveView] = useState<"dashboard" | "detail" | "candidate_standalone">("dashboard");
  const [initialDetailTab, setInitialDetailTab] = useState<string>("overview");

  // Modal and loading states
  const [isNewScreeningOpen, setIsNewScreeningOpen] = useState(false);
  const [isScreeningLoading, setIsScreeningLoading] = useState(false);
  const [screeningStepText, setScreeningStepText] = useState("");
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check URL query parameters for standalone candidate portal mode
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const candidateId = params.get("candidate");
    const mode = params.get("mode");

    if (candidateId) {
      fetchCandidateDetail(candidateId).then((session) => {
        if (session) {
          if (mode === "candidate") {
            setActiveView("candidate_standalone");
          } else {
            setActiveView("detail");
          }
        }
      });
    }

    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch("/api/sessions");
      const data = await res.json();
      if (data.success && Array.isArray(data.sessions)) {
        setSessions(data.sessions);
      }
    } catch (err) {
      console.error("Failed to load sessions:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchCandidateDetail = async (id: string, targetTab?: string): Promise<CandidateSession | null> => {
    try {
      const res = await fetch(`/api/session/${id}`);
      const data = await res.json();
      if (data.success && data.session) {
        setActiveSession(data.session);
        if (targetTab) setInitialDetailTab(targetTab);
        return data.session;
      }
    } catch (err) {
      console.error("Failed to load candidate detail:", err);
    }
    return null;
  };

  const handleSelectCandidate = async (id: string, initialTab: string = "overview") => {
    const session = await fetchCandidateDetail(id, initialTab);
    if (session) {
      setActiveView("detail");
    }
  };

  const handleScreenCandidate = async (
    jobSpecText: string,
    resumeText: string,
    jobTitle?: string,
    candidateName?: string
  ) => {
    setIsScreeningLoading(true);
    setScreeningStepText("Extracting resume entities & work history...");

    try {
      setTimeout(() => {
        setScreeningStepText("Comparing qualifications & computing gap analysis...");
      }, 1500);

      setTimeout(() => {
        setScreeningStepText("Synthesizing tailored behavioral & technical questions...");
      }, 3500);

      const res = await fetch("/api/screen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobSpecText,
          resumeText,
          jobDetails: { title: jobTitle },
          candidateNameHint: candidateName,
        }),
      });

      const data = await res.json();
      if (!data.success || !data.session) {
        throw new Error(data.error || "Failed to screen candidate.");
      }

      setIsNewScreeningOpen(false);
      setActiveSession(data.session);
      setInitialDetailTab("overview");
      setActiveView("detail");
      await fetchSessions();
    } catch (err: any) {
      console.error("Screening error:", err);
      throw err;
    } finally {
      setIsScreeningLoading(false);
      setScreeningStepText("");
    }
  };

  const handleSelectPreset = async (presetIdx: number) => {
    const preset = PRESETS[presetIdx];
    if (!preset) return;

    // Check if we already have an existing session matching this preset name
    const existing = sessions.find((s) => s.candidateName.toLowerCase() === preset.name.toLowerCase());
    if (existing) {
      await handleSelectCandidate(existing.id, "overview");
      return;
    }

    // Otherwise screen it automatically
    await handleScreenCandidate(preset.jobSpecText, preset.resumeText, preset.jobTitle, preset.name);
  };

  const handleSendMessage = async (text: string, sender: "candidate" | "recruiter" = "candidate") => {
    if (!activeSession) return;

    // Optimistically update candidate message
    const tempCandMsg = {
      id: `temp-${Date.now()}`,
      sender,
      content: text,
      timestamp: new Date().toISOString(),
    };

    const updatedTranscript = [...activeSession.transcript, tempCandMsg];
    setActiveSession({
      ...activeSession,
      transcript: updatedTranscript,
      status: "in_interview",
    });

    setIsAiResponding(true);

    try {
      const res = await fetch(`/api/session/${activeSession.id}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, sender }),
      });

      const data = await res.json();
      if (data.success && data.message) {
        setActiveSession((prev) => {
          if (!prev) return null;
          // Filter out temp message if server returned it, replace with official transcript
          const withoutTemp = prev.transcript.filter((m) => !m.id.startsWith("temp-"));
          return {
            ...prev,
            status: "in_interview",
            activeQuestionIndex: data.activeQuestionIndex !== undefined ? data.activeQuestionIndex : prev.activeQuestionIndex,
            transcript: [...withoutTemp, tempCandMsg, data.message],
          };
        });
      }
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setIsAiResponding(false);
      await fetchSessions();
    }
  };

  const handleInjectQuestion = async (questionText: string) => {
    if (!activeSession) return;
    try {
      const res = await fetch(`/api/session/${activeSession.id}/inject-question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionText }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchCandidateDetail(activeSession.id);
      }
    } catch (err) {
      console.error("Failed to inject question:", err);
    }
  };

  const handleFlagMessage = async (
    messageId: string,
    flagType: "strength" | "concern" | "followup_needed" | "star_answer",
    note: string
  ) => {
    if (!activeSession) return;
    try {
      const res = await fetch(`/api/session/${activeSession.id}/flag-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId, flagType, note }),
      });
      const data = await res.json();
      if (data.success) {
        setActiveSession((prev) => {
          if (!prev) return null;
          const updated = prev.transcript.map((m) => {
            if (m.id === messageId) {
              return { ...m, recruiterFlags: data.flags };
            }
            return m;
          });
          return { ...prev, transcript: updated };
        });
      }
    } catch (err) {
      console.error("Failed to flag message:", err);
    }
  };

  const handleSaveNotes = async (notes: string) => {
    if (!activeSession) return;
    try {
      await fetch(`/api/session/${activeSession.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
    } catch (err) {
      console.error("Failed to save notes:", err);
    }
  };

  const handleGenerateReport = async () => {
    if (!activeSession) return;
    setIsGeneratingReport(true);
    try {
      const res = await fetch(`/api/session/${activeSession.id}/generate-report`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success && data.report) {
        setActiveSession((prev) => (prev ? { ...prev, status: "completed", report: data.report } : null));
        
        // Trigger celebratory confetti
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (e) {}

        await fetchSessions();
      }
    } catch (err) {
      console.error("Failed to generate report:", err);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleUpdateQuestions = async (questions: TailoredQuestion[]) => {
    if (!activeSession) return;
    try {
      const res = await fetch(`/api/session/${activeSession.id}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions }),
      });
      const data = await res.json();
      if (data.success) {
        setActiveSession((prev) => (prev ? { ...prev, tailoredQuestions: questions } : null));
      }
    } catch (err) {
      console.error("Failed to update questions:", err);
    }
  };

  const handleDeleteSession = async (id: string) => {
    try {
      await fetch(`/api/session/${id}`, { method: "DELETE" });
      await fetchSessions();
      if (activeSession?.id === id) {
        setActiveSession(null);
        setActiveView("dashboard");
      }
    } catch (err) {
      console.error("Failed to delete session:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {activeView === "candidate_standalone" && activeSession ? (
        <CandidatePortalStandalone
          session={activeSession}
          onSendMessage={(text) => handleSendMessage(text, "candidate")}
          isAiResponding={isAiResponding}
          onBackToRecruiter={() => setActiveView("detail")}
        />
      ) : (
        <>
          <Navbar
            activeView={activeView}
            onNavigateHome={() => setActiveView("dashboard")}
            onOpenNewScreening={() => setIsNewScreeningOpen(true)}
            selectedCandidateName={activeSession?.candidateName}
            onRefresh={fetchSessions}
            isRefreshing={isRefreshing}
          />

          <main className="flex-1">
            {activeView === "dashboard" && (
              <CandidateDashboard
                sessions={sessions}
                onSelectCandidate={handleSelectCandidate}
                onOpenNewScreening={() => setIsNewScreeningOpen(true)}
                onDeleteSession={handleDeleteSession}
                onSelectPreset={handleSelectPreset}
              />
            )}

            {activeView === "detail" && activeSession && (
              <CandidateDetailView
                session={activeSession}
                initialTab={initialDetailTab}
                onBack={() => setActiveView("dashboard")}
                onUpdateSession={(updated) => setActiveSession(updated)}
                onSendMessage={handleSendMessage}
                onInjectQuestion={handleInjectQuestion}
                onFlagMessage={handleFlagMessage}
                onSaveNotes={handleSaveNotes}
                onGenerateReport={handleGenerateReport}
                onUpdateQuestions={handleUpdateQuestions}
                isAiResponding={isAiResponding}
                isGeneratingReport={isGeneratingReport}
              />
            )}
          </main>
        </>
      )}

      {/* New Screening Modal */}
      <NewScreeningModal
        isOpen={isNewScreeningOpen}
        onClose={() => setIsNewScreeningOpen(false)}
        onScreenCandidate={handleScreenCandidate}
        isLoading={isScreeningLoading}
        loadingStep={screeningStepText}
      />
    </div>
  );
}
