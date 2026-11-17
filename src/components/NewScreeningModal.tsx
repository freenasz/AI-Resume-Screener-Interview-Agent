import React, { useState } from "react";
import { 
  X, 
  UploadCloud, 
  FileText, 
  Sparkles, 
  Check, 
  AlertCircle, 
  Loader2, 
  User, 
  Briefcase,
  Layers,
  ArrowRight
} from "lucide-react";
import { PRESETS } from "../data/presets";

interface NewScreeningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScreenCandidate: (jobSpecText: string, resumeText: string, jobTitle?: string, candidateName?: string) => Promise<void>;
  isLoading: boolean;
  loadingStep?: string;
}

export const NewScreeningModal: React.FC<NewScreeningModalProps> = ({
  isOpen,
  onClose,
  onScreenCandidate,
  isLoading,
  loadingStep
}) => {
  const [activeTab, setActiveTab] = useState<"custom" | "presets">("custom");
  const [selectedPresetIdx, setSelectedPresetIdx] = useState<number>(0);
  
  // Custom inputs
  const [jobTitle, setJobTitle] = useState("");
  const [jobSpecText, setJobSpecText] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: "job" | "resume") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (target === "job") {
        setJobSpecText(text);
        if (!jobTitle) {
          setJobTitle(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
        }
      } else {
        setResumeText(text);
        if (!candidateName) {
          setCandidateName(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
        }
      }
    };
    reader.readAsText(file);
  };

  const handlePresetSelect = (idx: number) => {
    setSelectedPresetIdx(idx);
    const preset = PRESETS[idx];
    setJobTitle(preset.jobTitle);
    setJobSpecText(preset.jobSpecText);
    setCandidateName(preset.name);
    setResumeText(preset.resumeText);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    let targetJob = jobSpecText;
    let targetResume = resumeText;
    let targetTitle = jobTitle;
    let targetName = candidateName;

    if (activeTab === "presets") {
      const preset = PRESETS[selectedPresetIdx];
      targetJob = preset.jobSpecText;
      targetResume = preset.resumeText;
      targetTitle = preset.jobTitle;
      targetName = preset.name;
    }

    if (!targetJob.trim() || !targetResume.trim()) {
      setErrorMessage("Please provide both Job Description and Candidate Resume.");
      return;
    }

    try {
      await onScreenCandidate(targetJob, targetResume, targetTitle, targetName);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to complete AI screening. Please check inputs.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-[#E5E7EB] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#111827]">New Candidate AI Screening</h2>
              <p className="text-xs text-gray-500">Extract skills, calculate match gap analysis, and generate tailored questions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 rounded-lg text-gray-400 hover:text-[#111827] hover:bg-gray-100 transition-colors disabled:opacity-50"
            id="close-screening-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[#E5E7EB] px-6 pt-3 bg-white text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("custom")}
            className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "custom"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-[#111827]"
            }`}
          >
            <FileText className="w-4 h-4" />
            Upload & Paste Custom
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("presets")}
            className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "presets"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-[#111827]"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Choose 1-Click Demo Profile
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {activeTab === "presets" ? (
            <div className="space-y-4">
              <p className="text-xs text-gray-600">
                Select one of our curated candidate & job description pairs to run the complete analysis and interview suite instantly:
              </p>

              <div className="grid grid-cols-1 gap-3">
                {PRESETS.map((preset, idx) => (
                  <div
                    key={idx}
                    onClick={() => handlePresetSelect(idx)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between ${
                      selectedPresetIdx === idx
                        ? "border-indigo-600 bg-indigo-50/40 shadow-sm"
                        : "border-[#E5E7EB] bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#111827]">{preset.name}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                          {preset.jobTitle}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{preset.roleDescription}</p>
                    </div>
                    {selectedPresetIdx === idx && (
                      <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Job Spec Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-indigo-600" />
                    Job Description / Spec
                  </label>
                  <label className="text-xs text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer flex items-center gap-1">
                    <UploadCloud className="w-3.5 h-3.5" />
                    Upload File (.txt, .md)
                    <input
                      type="file"
                      accept=".txt,.md,.json,.doc,.docx"
                      onChange={(e) => handleFileUpload(e, "job")}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Job Title (e.g. Senior Full-Stack Engineer)"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg text-xs border border-[#E5E7EB] bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  <input
                    type="text"
                    placeholder="Candidate Name (e.g. Alex Rivera)"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg text-xs border border-[#E5E7EB] bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <textarea
                  rows={4}
                  placeholder="Paste job description (responsibilities, required skills, seniority, domain background)..."
                  value={jobSpecText}
                  onChange={(e) => setJobSpecText(e.target.value)}
                  className="w-full p-3.5 rounded-lg text-xs border border-[#E5E7EB] bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono text-[#111827] placeholder:font-sans"
                />
              </div>

              {/* Resume Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-indigo-600" />
                    Candidate Resume Content
                  </label>
                  <label className="text-xs text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer flex items-center gap-1">
                    <UploadCloud className="w-3.5 h-3.5" />
                    Upload File (.txt, .md, .pdf text)
                    <input
                      type="file"
                      accept=".txt,.md,.pdf,.doc,.docx"
                      onChange={(e) => handleFileUpload(e, "resume")}
                      className="hidden"
                    />
                  </label>
                </div>
                <textarea
                  rows={6}
                  placeholder="Paste candidate resume (experience, education, skills, metrics, certifications)..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="w-full p-3.5 rounded-lg text-xs border border-[#E5E7EB] bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono text-[#111827] placeholder:font-sans"
                />
              </div>
            </div>
          )}

          {/* Loading Animation Status */}
          {isLoading && (
            <div className="p-4 rounded-xl bg-indigo-50/80 border border-indigo-200 space-y-3 animate-pulse">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                <span className="text-xs font-bold text-indigo-900">
                  {loadingStep || "AI Agent is parsing resume & analyzing gap match..."}
                </span>
              </div>
              <div className="w-full bg-indigo-200/50 rounded-full h-1.5 overflow-hidden">
                <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: "70%" }} />
              </div>
            </div>
          )}

          {/* Footer Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-lg text-xs font-semibold text-gray-600 hover:text-[#111827] hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow transition-all flex items-center gap-2 disabled:opacity-50"
              id="submit-screening-btn"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing Pipeline...
                </>
              ) : (
                <>
                  Run AI Screening
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
