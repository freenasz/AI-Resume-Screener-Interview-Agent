import React, { useState } from "react";
import { 
  HelpCircle, 
  Target, 
  Sparkles, 
  Plus, 
  Trash2, 
  ArrowRight, 
  CheckSquare, 
  Lightbulb, 
  MessageSquare,
  ShieldAlert,
  Edit2
} from "lucide-react";
import { CandidateSession, TailoredQuestion } from "../../types";

interface QuestionsTabProps {
  session: CandidateSession;
  onUpdateQuestions: (questions: TailoredQuestion[]) => Promise<void>;
  onNavigateTab: (tab: "live_interview") => void;
}

export const QuestionsTab: React.FC<QuestionsTabProps> = ({
  session,
  onUpdateQuestions,
  onNavigateTab
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  
  // New question form state
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newCategory, setNewCategory] = useState<string>("technical");
  const [newCompetency, setNewCompetency] = useState("");
  const [newRationale, setNewRationale] = useState("");
  const [newWhatToLookFor, setNewWhatToLookFor] = useState("");

  const questions = session.tailoredQuestions || [];

  const filteredQuestions = questions.filter((q) => {
    if (selectedCategory === "all") return true;
    return q.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const getCategoryBadge = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "gap_probing":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            Gap Probing
          </span>
        );
      case "technical":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            Technical
          </span>
        );
      case "behavioral":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Behavioral
          </span>
        );
      case "leadership":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
            Leadership
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 capitalize">
            {cat}
          </span>
        );
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const newQ: TailoredQuestion = {
      id: `q-custom-${Date.now()}`,
      questionText: newQuestionText.trim(),
      category: newCategory,
      targetCompetency: newCompetency.trim() || "Custom Recruiter Assessment",
      rationale: newRationale.trim() || "Directly added by recruiting team.",
      whatToLookFor: newWhatToLookFor
        ? newWhatToLookFor.split(",").map((s) => s.trim()).filter(Boolean)
        : ["Clear communication", "Concrete evidence"],
      followUpTips: ["Probe for specific technical architecture or metrics"]
    };

    const updated = [...questions, newQ];
    await onUpdateQuestions(updated);
    
    // Reset
    setNewQuestionText("");
    setNewCompetency("");
    setNewRationale("");
    setNewWhatToLookFor("");
    setIsAddingCustom(false);
  };

  const handleDeleteQuestion = async (id: string) => {
    const updated = questions.filter((q) => q.id !== id);
    await onUpdateQuestions(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[#111827]">
              Personalized Question Curriculum ({questions.length})
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
              AI Tailored
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Engineered specifically to verify {session.candidateName}'s resume claims and probe identified skill gaps.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddingCustom(!isAddingCustom)}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-all flex items-center gap-1.5"
            id="add-custom-question-btn"
          >
            <Plus className="w-4 h-4" />
            Add Custom Question
          </button>

          <button
            onClick={() => onNavigateTab("live_interview")}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all flex items-center gap-1.5"
            id="start-interview-tab-btn"
          >
            <MessageSquare className="w-4 h-4" />
            Start Live Interview
          </button>
        </div>
      </div>

      {/* Add Custom Question Form Drawer */}
      {isAddingCustom && (
        <form onSubmit={handleAddQuestion} className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm space-y-4 animate-in fade-in">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900">Add Tailored Question to Curriculum</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E7EB] bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="technical">Technical</option>
                <option value="gap_probing">Gap Probing</option>
                <option value="behavioral">Behavioral</option>
                <option value="leadership">Leadership</option>
                <option value="scenario">Scenario</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Target Competency</label>
              <input
                type="text"
                placeholder="e.g. Distributed Caching & Invalidation"
                value={newCompetency}
                onChange={(e) => setNewCompetency(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E7EB] bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">Question Prompt</label>
            <textarea
              rows={2}
              placeholder="What question should the AI ask the candidate?"
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              className="w-full p-3 text-xs rounded-lg border border-[#E5E7EB] bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Rationale / Context</label>
              <input
                type="text"
                placeholder="Why are we asking this? (e.g. Resume mentions Redis)"
                value={newRationale}
                onChange={(e) => setNewRationale(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E7EB] bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">What to Look For (comma-separated)</label>
              <input
                type="text"
                placeholder="e.g. Mentions TTLs, Distributed locks, Scale metrics"
                value={newWhatToLookFor}
                onChange={(e) => setNewWhatToLookFor(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E7EB] bg-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingCustom(false)}
              className="px-3.5 py-1.5 text-xs text-gray-600 hover:text-[#111827]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
            >
              Save Question
            </button>
          </div>
        </form>
      )}

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
        {["all", "technical", "gap_probing", "behavioral", "leadership"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? "bg-[#111827] text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-[#E5E7EB]"
            }`}
          >
            {cat === "all" ? "All Questions" : cat.replace("_", " ").toUpperCase()}
          </button>
        ))}
      </div>

      {/* Questions Cards List */}
      <div className="space-y-4">
        {filteredQuestions.map((q, idx) => (
          <div
            key={q.id || idx}
            className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm space-y-4 hover:border-indigo-300 transition-all group"
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-700 text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                {getCategoryBadge(q.category)}
                <span className="text-xs font-bold text-gray-700 flex items-center gap-1">
                  <Target className="w-3.5 h-3.5 text-indigo-600" />
                  {q.targetCompetency}
                </span>
              </div>

              <button
                onClick={() => handleDeleteQuestion(q.id)}
                className="p-1.5 rounded-lg text-gray-300 hover:text-rose-600 hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100"
                title="Remove question"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Question Text */}
            <p className="text-sm font-semibold text-[#111827] leading-relaxed bg-[#F9FAFB] p-4 rounded-xl border border-[#E5E7EB]">
              "{q.questionText}"
            </p>

            {/* Evaluation Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Rationale */}
              <div className="space-y-1.5 bg-[#F9FAFB] p-3 rounded-xl border border-[#E5E7EB]">
                <span className="font-bold text-gray-700 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  Generation Rationale
                </span>
                <p className="text-gray-600 leading-relaxed">{q.rationale}</p>
              </div>

              {/* What to look for */}
              <div className="space-y-1.5 bg-indigo-50/40 p-3 rounded-xl border border-indigo-100">
                <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
                  What to Listen For (Positive Signals)
                </span>
                <ul className="space-y-1 text-gray-600">
                  {q.whatToLookFor.map((item, wIdx) => (
                    <li key={wIdx} className="flex items-start gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
