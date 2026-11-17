export type SessionStatus = 'screening' | 'ready_for_interview' | 'in_interview' | 'completed';

export type RecommendationType = 'strong_hire' | 'hire' | 'potential_maybe' | 'do_not_pass';

export interface EducationItem {
  degree: string;
  institution: string;
  year?: string;
  field?: string;
}

export interface WorkHistoryItem {
  role: string;
  company: string;
  period: string;
  description: string;
  highlights?: string[];
}

export interface ParsedResume {
  candidateName: string;
  email?: string;
  phone?: string;
  location?: string;
  summary: string;
  yearsOfExperience: number;
  skills: string[];
  education: EducationItem[];
  workHistory: WorkHistoryItem[];
  certifications?: string[];
  rawText?: string;
}

export interface JobSpec {
  id?: string;
  title: string;
  department?: string;
  seniority?: string;
  summary: string;
  requiredSkills: string[];
  niceToHaveSkills?: string[];
  responsibilities: string[];
  rawText?: string;
}

export interface VagueClaimProbe {
  claim: string;
  concern: string;
  suggestedProbe: string;
}

export interface GapAnalysis {
  matchScore: number;
  matchSummary: string;
  keyStrengths: string[];
  gapsOrMissingSkills: string[];
  unverifiableOrVagueClaims: VagueClaimProbe[];
  seniorityFit?: string;
  fitAnalysis?: {
    technicalScore: number;
    experienceScore: number;
    domainScore: number;
  };
}

export interface TailoredQuestion {
  id: string;
  category: 'behavioral' | 'technical' | 'gap_probing' | 'scenario' | 'leadership' | string;
  questionText: string;
  targetCompetency: string;
  rationale: string;
  whatToLookFor: string[];
  followUpTips?: string[];
}

export interface MessageFlag {
  flag: 'strength' | 'concern' | 'followup_needed' | 'star_answer';
  note: string;
  timestamp: string;
}

export interface InterviewMessage {
  id: string;
  sender: 'ai' | 'candidate' | 'recruiter' | 'system';
  content: string;
  timestamp: string;
  questionId?: string;
  isFollowUp?: boolean;
  isRecruiterInjected?: boolean;
  internalNote?: string;
  recruiterFlags?: MessageFlag[];
}

export interface CompetencyScore {
  score: number;
  notes: string;
}

export interface PerQuestionEvaluation {
  questionId?: string;
  questionText: string;
  category?: string;
  candidateAnswerSummary: string;
  score: number;
  strengthsObserved?: string[];
  concernsIdentified?: string[];
  verdict: 'strong' | 'acceptable' | 'weak' | 'skipped';
}

export interface NotableQuote {
  quote: string;
  context: string;
  sentiment: 'positive' | 'neutral' | 'caution' | string;
}

export interface InterviewSummaryReport {
  completedAt: string;
  overallRecommendation: RecommendationType;
  recommendationSummary: string;
  overallScore: number;
  competencyScores: {
    technicalProficiency: CompetencyScore;
    communicationAndClarity: CompetencyScore;
    problemSolving: CompetencyScore;
    cultureAndRoleFit: CompetencyScore;
    experienceVerification: CompetencyScore;
  };
  perQuestionEvaluation: PerQuestionEvaluation[];
  notableQuotes: NotableQuote[];
  redFlags: string[];
  nextStepsRecommendation: string;
}

export interface CandidateSession {
  id: string;
  candidateName: string;
  jobTitle: string;
  status: SessionStatus;
  createdAt: string;
  jobSpec: JobSpec;
  parsedResume: ParsedResume;
  gapAnalysis?: GapAnalysis;
  tailoredQuestions: TailoredQuestion[];
  activeQuestionIndex: number;
  transcript: InterviewMessage[];
  recruiterNotes?: string;
  report?: InterviewSummaryReport;
  recruiterInjectedQueue?: string[];
}

export interface SessionSummary {
  id: string;
  candidateName: string;
  jobTitle: string;
  status: SessionStatus;
  createdAt: string;
  matchScore: number;
  recommendation: RecommendationType | null;
  overallScore: number | null;
  totalQuestions: number;
  answeredQuestions: number;
}

export interface PresetData {
  name: string;
  jobTitle: string;
  roleDescription: string;
  jobSpecText: string;
  resumeText: string;
}
