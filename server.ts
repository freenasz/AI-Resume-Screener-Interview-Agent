import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Storage setup for sessions
const DATA_DIR = path.join(process.cwd(), "data");
const SESSIONS_FILE = path.join(DATA_DIR, "sessions.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory cache + persistence
let sessionsStore: Record<string, any> = {};

// SSE connections for real-time sync per session
const sseClients: Record<string, express.Response[]> = {};

function notifyClients(sessionId: string, eventType: string, data: any) {
  const clients = sseClients[sessionId];
  if (clients && clients.length > 0) {
    const payload = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
    clients.forEach((res) => {
      try {
        res.write(payload);
      } catch (err) {
        // Handle disconnected client
      }
    });
  }
}

function loadSessionsFromDisk() {
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      const raw = fs.readFileSync(SESSIONS_FILE, "utf-8");
      sessionsStore = JSON.parse(raw);
    } else {
      seedInitialSessions();
    }
  } catch (err) {
    console.error("Error reading sessions file:", err);
    seedInitialSessions();
  }
}

function saveSessionsToDisk() {
  try {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessionsStore, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving sessions:", err);
  }
}

function seedInitialSessions() {
  const seed1 = {
    id: "alex-rivera-sr-dev",
    candidateName: "Alex Rivera",
    jobTitle: "Senior Full-Stack Engineer",
    status: "ready_for_interview",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    jobSpec: {
      id: "job-sr-dev-101",
      title: "Senior Full-Stack Engineer",
      department: "Platform Engineering",
      seniority: "Senior (5+ years)",
      summary: "Looking for a high-impact engineer to architect distributed React + Node.js microservices, lead Kafka event pipelines, and optimize database querying.",
      requiredSkills: ["TypeScript", "React", "Node.js", "Distributed Systems", "Kafka", "PostgreSQL", "System Architecture"],
      niceToHaveSkills: ["Docker/Kubernetes", "Redis Caching", "GraphQL", "CI/CD automation"],
      responsibilities: [
        "Architect scalable frontend applications and resilient backend microservices",
        "Implement high-throughput event streaming with Kafka for real-time analytics",
        "Lead technical design reviews and mentor mid-level engineers",
        "Optimize complex PostgreSQL queries and caching strategies"
      ],
      rawText: "Senior Full-Stack Engineer Job Description\nWe are looking for a Senior Full-Stack Engineer with 5+ years of experience in TypeScript, React, and Node.js backend services. You will design distributed systems, manage Kafka streaming pipelines, and optimize low-latency APIs. Must have strong architectural leadership and SQL tuning capabilities."
    },
    parsedResume: {
      candidateName: "Alex Rivera",
      email: "alex.rivera.dev@example.com",
      phone: "+1 (555) 382-9102",
      location: "San Francisco, CA (Remote)",
      summary: "Senior Full-Stack Software Engineer with 6 years building high-scale web platforms using React, Node.js, and GraphQL. Experienced with AWS cloud infrastructure and microservices.",
      yearsOfExperience: 6,
      skills: ["React", "TypeScript", "Node.js", "GraphQL", "Next.js", "PostgreSQL", "AWS ECS", "Docker", "REST APIs", "Tailwind CSS"],
      education: [
        {
          degree: "B.S. in Computer Science",
          institution: "University of Washington",
          year: "2018",
          field: "Computer Science"
        }
      ],
      workHistory: [
        {
          role: "Lead Frontend / Full-Stack Engineer",
          company: "PulseTech Solutions",
          period: "2021 - Present",
          description: "Led development of real-time analytics dashboard serving 150k daily active users.",
          highlights: [
            "Architected Next.js and Node.js microservices with 99.95% uptime",
            "Reduced client bundle size by 42% through code-splitting and dynamic imports",
            "Mentored team of 4 junior and mid-level developers"
          ]
        },
        {
          role: "Software Engineer",
          company: "CloudVibe Media",
          period: "2018 - 2021",
          description: "Built scalable REST & GraphQL APIs and modern single page apps in React.",
          highlights: [
            "Migrated legacy monolithic frontend to modern React + TypeScript",
            "Implemented Redis caching layer decreasing API latency by 35%"
          ]
        }
      ],
      certifications: ["AWS Certified Developer - Associate"]
    },
    gapAnalysis: {
      matchScore: 84,
      matchSummary: "Strong technical match in TypeScript, React, and Node.js with 6 years of solid full-stack experience. High proficiency in microservices and caching. Primary gap is lack of explicit Apache Kafka / message broker event-streaming on resume.",
      keyStrengths: [
        "6 years of deep TypeScript, React, and Node.js microservices development",
        "Demonstrated technical leadership and mentoring experience",
        "Practical database optimization and Redis caching experience with measured latency reductions",
        "Strong cloud infrastructure experience on AWS"
      ],
      gapsOrMissingSkills: [
        "Apache Kafka event streaming is required by job spec but unmentioned in work history",
        "Limited mention of high-throughput distributed message queues (e.g., RabbitMQ/Kafka)",
        "Kubernetes orchestration experience not explicitly detailed"
      ],
      unverifiableOrVagueClaims: [
        {
          claim: "Architected microservices serving 150k daily active users with 99.95% uptime",
          concern: "Does not explain how failover, distributed transactions, or data consistency across microservices were managed",
          suggestedProbe: "Ask Alex to break down how they handled distributed data consistency and disaster recovery in the 99.95% uptime architecture."
        },
        {
          claim: "Implemented Redis caching layer decreasing API latency by 35%",
          concern: "Vague on cache invalidation strategy and edge-case handling under heavy write loads",
          suggestedProbe: "Probe on specific cache invalidation patterns and how race conditions were prevented."
        }
      ],
      seniorityFit: "matched",
      fitAnalysis: {
        technicalScore: 86,
        experienceScore: 90,
        domainScore: 78
      }
    },
    tailoredQuestions: [
      {
        id: "q-1",
        category: "technical",
        questionText: "We saw you architected Node.js microservices for 150k DAUs. How did you design service-to-service communication, and how did you maintain consistency without tight coupling?",
        targetCompetency: "Microservices Architecture & Distributed Systems",
        rationale: "Probes architectural depth and verifies how the candidate solves distributed state challenges.",
        whatToLookFor: ["Mentions async communication", "Event-driven patterns", "Handling network partitions/retries", "Idempotency"],
        followUpTips: ["Ask about what failed in production and how they fixed it"]
      },
      {
        id: "q-2",
        category: "gap_probing",
        questionText: "Our platform heavily relies on Apache Kafka for high-throughput event streaming. While your resume highlights Redis and GraphQL, what is your experience with message brokers and event-driven pipelines?",
        targetCompetency: "Message Queues & Event Streaming (Kafka / PubSub)",
        rationale: "Directly addresses the Kafka gap identified in the resume comparison.",
        whatToLookFor: ["Understanding of topics/partitions", "Offset management", "Backpressure handling", "Willingness to ramp up"],
        followUpTips: ["If they lack Kafka, ask how they would apply their queue/caching knowledge to learn it fast"]
      },
      {
        id: "q-3",
        category: "technical",
        questionText: "You mentioned reducing API latency by 35% using Redis caching. Can you walk me through your cache invalidation strategy and how you prevented cache stampedes?",
        targetCompetency: "Caching Strategies & Database Performance",
        rationale: "Verifies the metric claim on the resume and evaluates depth in distributed caching.",
        whatToLookFor: ["Cache-aside vs write-through", "TTL strategies", "Distributed locks or probabilistic early expiration", "Handling cache misses under load"],
        followUpTips: ["Ask about write-heavy scenarios"]
      },
      {
        id: "q-4",
        category: "behavioral",
        questionText: "Tell me about a time when a critical production issue occurred under your watch. How did you isolate the root cause and coordinate resolution?",
        targetCompetency: "Incident Management & Problem Solving",
        rationale: "Evaluates composure under pressure and diagnostic methodology.",
        whatToLookFor: ["Structured debugging approach", "Monitoring/logging utilization", "Blameless post-mortem", "Preventative action items"],
        followUpTips: ["Ask what preventative alerting was introduced afterwards"]
      },
      {
        id: "q-5",
        category: "leadership",
        questionText: "As someone who has mentored developers, how do you handle a code review where a team member's pull request has fundamental architectural flaws?",
        targetCompetency: "Mentorship & Code Review Standards",
        rationale: "Assesses senior engineering leadership, empathy, and constructive feedback style.",
        whatToLookFor: ["Empathetic communication", "Explaining the 'why' rather than dictating", "Pair programming or whiteboard session"],
        followUpTips: ["Ask how they balance strict quality standards with delivery speed"]
      }
    ],
    activeQuestionIndex: 0,
    transcript: [
      {
        id: "msg-1",
        sender: "ai",
        content: "Hi Alex! Welcome to your technical interview for the Senior Full-Stack Engineer position. We reviewed your background with React and Node microservices. To kick things off, could you briefly introduce yourself and share a recent engineering achievement you are most proud of?",
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
      }
    ],
    recruiterNotes: "Strong candidate on paper. Pay close attention to distributed systems and Kafka familiarity during the interview.",
    recruiterInjectedQueue: []
  };

  sessionsStore[seed1.id] = seed1;
  saveSessionsToDisk();
}

loadSessionsFromDisk();

// ================= API ROUTES =================

// 1. Get all candidate sessions
app.get("/api/sessions", (req, res) => {
  const list = Object.values(sessionsStore).map((s) => ({
    id: s.id,
    candidateName: s.candidateName,
    jobTitle: s.jobTitle,
    status: s.status,
    createdAt: s.createdAt,
    matchScore: s.gapAnalysis?.matchScore || 0,
    recommendation: s.report?.overallRecommendation || null,
    overallScore: s.report?.overallScore || null,
    totalQuestions: s.tailoredQuestions?.length || 0,
    answeredQuestions: s.activeQuestionIndex || 0,
  }));
  res.json({ success: true, sessions: list });
});

// 2. Get single candidate session
app.get("/api/session/:id", (req, res) => {
  const session = sessionsStore[req.params.id];
  if (!session) {
    return res.status(404).json({ success: false, error: "Session not found" });
  }
  res.json({ success: true, session });
});

// 3. Delete session
app.delete("/api/session/:id", (req, res) => {
  const id = req.params.id;
  if (sessionsStore[id]) {
    delete sessionsStore[id];
    saveSessionsToDisk();
    return res.json({ success: true });
  }
  res.status(404).json({ success: false, error: "Session not found" });
});

// 4. Server-Sent Events (SSE) for Real-Time Sync between Recruiter Live Monitor & Candidate View
app.get("/api/session/:id/events", (req, res) => {
  const sessionId = req.params.id;
  
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  if (!sseClients[sessionId]) {
    sseClients[sessionId] = [];
  }
  sseClients[sessionId].push(res);

  // Send initial ping
  res.write(`event: connected\ndata: ${JSON.stringify({ sessionId, timestamp: new Date().toISOString() })}\n\n`);

  req.on("close", () => {
    if (sseClients[sessionId]) {
      sseClients[sessionId] = sseClients[sessionId].filter((client) => client !== res);
      if (sseClients[sessionId].length === 0) {
        delete sseClients[sessionId];
      }
    }
  });
});

// 5. Parse Resume, Compare vs Job Spec & Generate Tailored Questions (AI Pipeline Step 1 & 2 & 3)
app.post("/api/screen", async (req, res) => {
  try {
    const { jobSpecText, resumeText, jobDetails, candidateNameHint } = req.body;

    if (!jobSpecText || !resumeText) {
      return res.status(400).json({ success: false, error: "Both Job Spec and Resume content are required." });
    }

    const prompt = `You are an elite talent evaluation and AI recruiter agent.
Analyze this job description and candidate resume. Extract structured data, perform a comprehensive gap/match analysis, and generate 8 to 10 tailored interview questions.

JOB DESCRIPTION:
${jobSpecText}

CANDIDATE RESUME:
${resumeText}

Analyze with high rigor:
1. Parse resume into structured data (candidateName, email, phone, location, summary, yearsOfExperience, education, workHistory, skills, certifications).
2. Compute a realistic matchScore (0 to 100) based on requirements vs actual evidence.
3. Identify 3-5 key strengths and 2-4 gaps or missing skills.
4. Identify 2-3 vague, unverifiable, or exaggerated claims on the resume that worth probing in the interview (with claim, concern, suggestedProbe).
5. Generate 8-10 personalized interview questions (mix of technical, behavioral, gap_probing, and scenario) tailored to THIS specific candidate and job spec. Each question must include targetCompetency, rationale, whatToLookFor list, and followUpTips.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            jobSpec: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                department: { type: Type.STRING },
                seniority: { type: Type.STRING },
                summary: { type: Type.STRING },
                requiredSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                niceToHaveSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["title", "summary", "requiredSkills", "responsibilities"],
            },
            parsedResume: {
              type: Type.OBJECT,
              properties: {
                candidateName: { type: Type.STRING },
                email: { type: Type.STRING },
                phone: { type: Type.STRING },
                location: { type: Type.STRING },
                summary: { type: Type.STRING },
                yearsOfExperience: { type: Type.NUMBER },
                skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                education: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      degree: { type: Type.STRING },
                      institution: { type: Type.STRING },
                      year: { type: Type.STRING },
                      field: { type: Type.STRING },
                    },
                    required: ["degree", "institution"],
                  },
                },
                workHistory: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      role: { type: Type.STRING },
                      company: { type: Type.STRING },
                      period: { type: Type.STRING },
                      description: { type: Type.STRING },
                      highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ["role", "company", "period"],
                  },
                },
                certifications: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["candidateName", "summary", "skills", "workHistory", "yearsOfExperience"],
            },
            gapAnalysis: {
              type: Type.OBJECT,
              properties: {
                matchScore: { type: Type.INTEGER },
                matchSummary: { type: Type.STRING },
                keyStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                gapsOrMissingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                unverifiableOrVagueClaims: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      claim: { type: Type.STRING },
                      concern: { type: Type.STRING },
                      suggestedProbe: { type: Type.STRING },
                    },
                    required: ["claim", "concern", "suggestedProbe"],
                  },
                },
                seniorityFit: { type: Type.STRING },
                fitAnalysis: {
                  type: Type.OBJECT,
                  properties: {
                    technicalScore: { type: Type.INTEGER },
                    experienceScore: { type: Type.INTEGER },
                    domainScore: { type: Type.INTEGER },
                  },
                  required: ["technicalScore", "experienceScore", "domainScore"],
                },
              },
              required: ["matchScore", "matchSummary", "keyStrengths", "gapsOrMissingSkills", "unverifiableOrVagueClaims", "fitAnalysis"],
            },
            tailoredQuestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  category: { type: Type.STRING },
                  questionText: { type: Type.STRING },
                  targetCompetency: { type: Type.STRING },
                  rationale: { type: Type.STRING },
                  whatToLookFor: { type: Type.ARRAY, items: { type: Type.STRING } },
                  followUpTips: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["category", "questionText", "targetCompetency", "rationale", "whatToLookFor"],
              },
            },
          },
          required: ["jobSpec", "parsedResume", "gapAnalysis", "tailoredQuestions"],
        },
      },
    });

    const parsedResult = JSON.parse(response.text || "{}");

    // Assign IDs to questions
    const questionsWithIds = (parsedResult.tailoredQuestions || []).map((q: any, i: number) => ({
      ...q,
      id: q.id || `q-${i + 1}`,
    }));

    const candidateName = parsedResult.parsedResume?.candidateName || candidateNameHint || "Candidate";
    const jobTitle = parsedResult.jobSpec?.title || jobDetails?.title || "Job Position";
    const sessionId = `cand-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    // Initial greeting from AI
    const initialGreeting = `Hello ${candidateName}! Thank you for meeting with us today for the ${jobTitle} position. We have reviewed your background and are excited to dive into your experience. When you're ready, let's start with a brief overview of your background and what excites you about this role.`;

    const newSession = {
      id: sessionId,
      candidateName,
      jobTitle,
      status: "ready_for_interview",
      createdAt: new Date().toISOString(),
      jobSpec: {
        ...parsedResult.jobSpec,
        id: `job-${Date.now()}`,
        rawText: jobSpecText,
      },
      parsedResume: {
        ...parsedResult.parsedResume,
        rawText: resumeText,
      },
      gapAnalysis: parsedResult.gapAnalysis,
      tailoredQuestions: questionsWithIds,
      activeQuestionIndex: 0,
      transcript: [
        {
          id: `msg-${Date.now()}`,
          sender: "ai",
          content: initialGreeting,
          timestamp: new Date().toISOString(),
        },
      ],
      recruiterNotes: "",
      recruiterInjectedQueue: [],
    };

    sessionsStore[sessionId] = newSession;
    saveSessionsToDisk();

    res.json({ success: true, session: newSession });
  } catch (error: any) {
    console.error("Screening error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to parse resume and screen candidate." });
  }
});

// 6. Live Chat Turn: Candidate sends a message -> AI generates next conversational turn or follow-up
app.post("/api/session/:id/chat", async (req, res) => {
  try {
    const sessionId = req.params.id;
    const { message, sender } = req.body;
    const session = sessionsStore[sessionId];

    if (!session) {
      return res.status(404).json({ success: false, error: "Session not found" });
    }

    // Append candidate message
    const candidateMsgObj = {
      id: `msg-${Date.now()}-cand`,
      sender: sender || "candidate",
      content: message,
      timestamp: new Date().toISOString(),
    };
    session.transcript.push(candidateMsgObj);
    session.status = "in_interview";

    // Notify recruiter view
    notifyClients(sessionId, "new_message", { message: candidateMsgObj, sessionStatus: session.status });

    // Check if there is an injected question from the recruiter
    let injectedQuestionPrompt = "";
    let wasInjected = false;
    if (session.recruiterInjectedQueue && session.recruiterInjectedQueue.length > 0) {
      const injectedQ = session.recruiterInjectedQueue.shift();
      injectedQuestionPrompt = `CRITICAL: The observing recruiter has requested that you ask this specific question next: "${injectedQ}". Acknowledge the candidate's last answer warmly and immediately transition to ask this question!`;
      wasInjected = true;
    }

    const currentQuestion = session.tailoredQuestions[session.activeQuestionIndex] || session.tailoredQuestions[session.tailoredQuestions.length - 1];
    const totalQuestions = session.tailoredQuestions.length;
    const currentIndex = session.activeQuestionIndex;

    const systemPrompt = `You are a world-class, professional, and friendly AI technical interviewer conducting a live synchronous interview with candidate ${session.candidateName} for the ${session.jobTitle} position.

CONTEXT:
Job Spec Summary: ${session.jobSpec?.summary || ""}
Required Skills: ${(session.jobSpec?.requiredSkills || []).join(", ")}
Candidate Resume Summary: ${session.parsedResume?.summary || ""}
Identified Gaps to Probe: ${(session.gapAnalysis?.gapsOrMissingSkills || []).join("; ")}
Vague Claims to Probe: ${JSON.stringify(session.gapAnalysis?.unverifiableOrVagueClaims || [])}

INTERVIEW PROGRESS:
Current Question Index: ${currentIndex + 1} of ${totalQuestions}
Current Target Question: "${currentQuestion?.questionText || "Wrap up and final thoughts"}"
Target Competency: "${currentQuestion?.targetCompetency || ""}"
What to listen for: ${(currentQuestion?.whatToLookFor || []).join(", ")}
Follow up tips: ${(currentQuestion?.followUpTips || []).join(", ")}

RECRUITER INJECTION DIRECTIVE:
${injectedQuestionPrompt}

CONVERSATION RULES:
1. Speak naturally, concisely, and with empathy. Avoid robotic repetition.
2. If the candidate's response to the current question was vague, incomplete, or made unsubstantiated claims without metrics or architecture details, ask a sharp, natural 1-2 sentence probing follow-up before moving to the next question.
3. If their answer was clear and thorough, provide a brief 1-sentence acknowledgment and transition smoothly to the NEXT planned interview question.
4. If they just completed the last question (${totalQuestions} of ${totalQuestions}), thank them warmly, ask if they have any quick questions for the company, and wrap up the interview gracefully.
5. Keep your turn under 3-4 sentences total so it feels like a real human dialogue.
6. Determine whether this turn was a "follow_up" probe or if you moved to the "next_question" or "concluded".`;

    const formattedTranscript = session.transcript.map((m: any) => `${m.sender.toUpperCase()}: ${m.content}`).join("\n");

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `${systemPrompt}\n\nFULL TRANSCRIPT SO FAR:\n${formattedTranscript}\n\nGenerate your next conversational response as the AI interviewer. Return JSON:`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            aiResponse: { type: Type.STRING },
            action: { type: Type.STRING, description: "One of: 'follow_up', 'next_question', 'wrap_up', 'injected_question'" },
            advanceQuestionIndex: { type: Type.BOOLEAN, description: "True if moving to next planned question" },
            internalNote: { type: Type.STRING, description: "Brief evaluation note for the recruiter live transcript" },
          },
          required: ["aiResponse", "action", "advanceQuestionIndex"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");

    if (result.advanceQuestionIndex && session.activeQuestionIndex < totalQuestions - 1) {
      session.activeQuestionIndex += 1;
    }

    const aiMsgObj = {
      id: `msg-${Date.now()}-ai`,
      sender: "ai",
      content: result.aiResponse,
      timestamp: new Date().toISOString(),
      questionId: currentQuestion?.id,
      isFollowUp: result.action === "follow_up",
      isRecruiterInjected: wasInjected,
      internalNote: result.internalNote,
    };

    session.transcript.push(aiMsgObj);

    if (result.action === "wrap_up" || session.activeQuestionIndex >= totalQuestions) {
      // If at end, candidate may be ready for report
    }

    saveSessionsToDisk();

    // Broadcast to recruiter & candidate
    notifyClients(sessionId, "new_message", {
      message: aiMsgObj,
      sessionStatus: session.status,
      activeQuestionIndex: session.activeQuestionIndex,
      action: result.action,
    });

    res.json({
      success: true,
      message: aiMsgObj,
      activeQuestionIndex: session.activeQuestionIndex,
      action: result.action,
    });
  } catch (error: any) {
    console.error("Chat turn error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to process chat response." });
  }
});

// 7. Recruiter injects question in real time
app.post("/api/session/:id/inject-question", (req, res) => {
  const sessionId = req.params.id;
  const { questionText } = req.body;
  const session = sessionsStore[sessionId];

  if (!session) {
    return res.status(404).json({ success: false, error: "Session not found" });
  }

  if (!questionText || !questionText.trim()) {
    return res.status(400).json({ success: false, error: "Question text is required." });
  }

  if (!session.recruiterInjectedQueue) {
    session.recruiterInjectedQueue = [];
  }
  session.recruiterInjectedQueue.push(questionText.trim());

  const systemMsg = {
    id: `msg-${Date.now()}-sys`,
    sender: "system",
    content: `Recruiter queued a custom question: "${questionText.trim()}". The AI agent will ask this next.`,
    timestamp: new Date().toISOString(),
    isRecruiterInjected: true,
  };
  session.transcript.push(systemMsg);
  saveSessionsToDisk();

  notifyClients(sessionId, "injected_question", { question: questionText.trim(), message: systemMsg });

  res.json({ success: true, message: "Question queued successfully." });
});

// 8. Recruiter flags a message with a tag or note
app.post("/api/session/:id/flag-message", (req, res) => {
  const sessionId = req.params.id;
  const { messageId, flagType, note } = req.body;
  const session = sessionsStore[sessionId];

  if (!session) {
    return res.status(404).json({ success: false, error: "Session not found" });
  }

  const targetMsg = session.transcript.find((m: any) => m.id === messageId);
  if (!targetMsg) {
    return res.status(404).json({ success: false, error: "Message not found" });
  }

  if (!targetMsg.recruiterFlags) {
    targetMsg.recruiterFlags = [];
  }

  targetMsg.recruiterFlags.push({
    flag: flagType || "strength",
    note: note || "",
    timestamp: new Date().toISOString(),
  });

  saveSessionsToDisk();
  notifyClients(sessionId, "message_flagged", { messageId, flags: targetMsg.recruiterFlags });

  res.json({ success: true, flags: targetMsg.recruiterFlags });
});

// 9. Update Recruiter Notes
app.post("/api/session/:id/notes", (req, res) => {
  const sessionId = req.params.id;
  const { notes } = req.body;
  const session = sessionsStore[sessionId];

  if (!session) {
    return res.status(404).json({ success: false, error: "Session not found" });
  }

  session.recruiterNotes = notes || "";
  saveSessionsToDisk();
  res.json({ success: true, notes: session.recruiterNotes });
});

// 10. Generate Interview Summary Report (AI Pipeline Step 4)
app.post("/api/session/:id/generate-report", async (req, res) => {
  try {
    const sessionId = req.params.id;
    const session = sessionsStore[sessionId];

    if (!session) {
      return res.status(404).json({ success: false, error: "Session not found" });
    }

    const prompt = `You are a Senior Talent Evaluator and Hiring Committee Chair.
Generate a comprehensive, objective, and deeply analytical Interview Summary Report for candidate ${session.candidateName} for the ${session.jobTitle} position.

JOB DESCRIPTION:
Title: ${session.jobSpec?.title}
Requirements: ${(session.jobSpec?.requiredSkills || []).join(", ")}
Responsibilities: ${(session.jobSpec?.responsibilities || []).join("; ")}

CANDIDATE RESUME SUMMARY:
${session.parsedResume?.summary || ""}
Years of Experience: ${session.parsedResume?.yearsOfExperience || "N/A"}

PRE-INTERVIEW GAP ANALYSIS:
Strengths: ${(session.gapAnalysis?.keyStrengths || []).join("; ")}
Gaps: ${(session.gapAnalysis?.gapsOrMissingSkills || []).join("; ")}
Vague Claims: ${JSON.stringify(session.gapAnalysis?.unverifiableOrVagueClaims || [])}

INTERVIEW TRANSCRIPT:
${session.transcript.map((m: any) => `[${m.sender.toUpperCase()}]: ${m.content}`).join("\n\n")}

RECRUITER NOTES:
${session.recruiterNotes || "No specific recruiter notes entered."}

INSTRUCTIONS:
1. Provide an executive overallRecommendation: exactly one of 'strong_hire', 'hire', 'potential_maybe', or 'do_not_pass'.
2. Provide an overallScore (0-100).
3. Evaluate 5 core competencies with scores (0-100) and specific evidence-based notes:
   - technicalProficiency
   - communicationAndClarity
   - problemSolving
   - cultureAndRoleFit
   - experienceVerification (did they verify the resume claims or were they shallow?)
4. Break down per-question evaluations with scores (1-10), observed strengths, concerns, and verdict ('strong', 'acceptable', 'weak', 'skipped').
5. Extract 3-5 real notable quotes from candidate responses with context and sentiment.
6. Highlight red flags or risks.
7. Outline specific next steps / hiring decision summary.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallRecommendation: { type: Type.STRING },
            recommendationSummary: { type: Type.STRING },
            overallScore: { type: Type.INTEGER },
            competencyScores: {
              type: Type.OBJECT,
              properties: {
                technicalProficiency: {
                  type: Type.OBJECT,
                  properties: { score: { type: Type.INTEGER }, notes: { type: Type.STRING } },
                  required: ["score", "notes"],
                },
                communicationAndClarity: {
                  type: Type.OBJECT,
                  properties: { score: { type: Type.INTEGER }, notes: { type: Type.STRING } },
                  required: ["score", "notes"],
                },
                problemSolving: {
                  type: Type.OBJECT,
                  properties: { score: { type: Type.INTEGER }, notes: { type: Type.STRING } },
                  required: ["score", "notes"],
                },
                cultureAndRoleFit: {
                  type: Type.OBJECT,
                  properties: { score: { type: Type.INTEGER }, notes: { type: Type.STRING } },
                  required: ["score", "notes"],
                },
                experienceVerification: {
                  type: Type.OBJECT,
                  properties: { score: { type: Type.INTEGER }, notes: { type: Type.STRING } },
                  required: ["score", "notes"],
                },
              },
              required: ["technicalProficiency", "communicationAndClarity", "problemSolving", "cultureAndRoleFit", "experienceVerification"],
            },
            perQuestionEvaluation: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  questionId: { type: Type.STRING },
                  questionText: { type: Type.STRING },
                  category: { type: Type.STRING },
                  candidateAnswerSummary: { type: Type.STRING },
                  score: { type: Type.INTEGER },
                  strengthsObserved: { type: Type.ARRAY, items: { type: Type.STRING } },
                  concernsIdentified: { type: Type.ARRAY, items: { type: Type.STRING } },
                  verdict: { type: Type.STRING },
                },
                required: ["questionText", "candidateAnswerSummary", "score", "verdict"],
              },
            },
            notableQuotes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  quote: { type: Type.STRING },
                  context: { type: Type.STRING },
                  sentiment: { type: Type.STRING },
                },
                required: ["quote", "context", "sentiment"],
              },
            },
            redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
            nextStepsRecommendation: { type: Type.STRING },
          },
          required: ["overallRecommendation", "recommendationSummary", "overallScore", "competencyScores", "perQuestionEvaluation", "notableQuotes", "redFlags", "nextStepsRecommendation"],
        },
      },
    });

    const reportData = JSON.parse(response.text || "{}");
    reportData.completedAt = new Date().toISOString();

    session.report = reportData;
    session.status = "completed";
    saveSessionsToDisk();

    notifyClients(sessionId, "report_generated", { report: reportData, sessionStatus: "completed" });

    res.json({ success: true, report: reportData });
  } catch (error: any) {
    console.error("Report generation error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to generate interview report." });
  }
});

// 11. Update Questions (e.g. Recruiter adds or reorders questions)
app.post("/api/session/:id/questions", (req, res) => {
  const sessionId = req.params.id;
  const { questions } = req.body;
  const session = sessionsStore[sessionId];

  if (!session) {
    return res.status(404).json({ success: false, error: "Session not found" });
  }

  if (Array.isArray(questions)) {
    session.tailoredQuestions = questions;
    saveSessionsToDisk();
    return res.json({ success: true, questions: session.tailoredQuestions });
  }

  res.status(400).json({ success: false, error: "Questions must be an array." });
});

// Setup Vite or Static File Serving
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Resume Screening & Interview Agent running on http://localhost:${PORT}`);
  });
}

start();
