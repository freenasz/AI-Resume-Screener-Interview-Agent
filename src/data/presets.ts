import { PresetData } from "../types";

export const PRESETS: PresetData[] = [
  {
    name: "Alex Rivera",
    jobTitle: "Senior Full-Stack Engineer",
    roleDescription: "Architect distributed React + Node.js microservices, Kafka event streaming & database optimization.",
    jobSpecText: `Job Title: Senior Full-Stack Engineer
Department: Core Platform Engineering
Seniority: Senior (5+ years)

About the Role:
We are seeking a seasoned Senior Full-Stack Engineer to lead the architecture and development of our mission-critical enterprise SaaS platform. You will build high-throughput microservices, design scalable real-time event streaming architectures, and mentor a high-performing engineering squad.

Core Responsibilities:
- Architect, build, and maintain resilient frontend applications in React/TypeScript and backend services in Node.js.
- Design and operate high-throughput event streaming pipelines using Apache Kafka for real-time telemetry and auditing.
- Optimize high-concurrency PostgreSQL queries, connection pooling, and multi-tier distributed caching (Redis).
- Drive architectural decisions, lead technical RFC discussions, and maintain 99.99% availability SLAs.
- Mentor junior and mid-level engineers, conduct rigorous code reviews, and champion engineering best practices.

Requirements & Qualifications:
- 5+ years of production experience in full-stack engineering with TypeScript, React, and Node.js.
- Deep hands-on experience with distributed systems architecture, event-driven designs, and Apache Kafka.
- Strong proficiency in SQL tuning, indexing strategies, and database query optimization.
- Solid experience with Docker, container orchestration, and cloud infrastructure (AWS/GCP).
- Excellent communication skills with proven ability to lead technical initiatives across squads.`,
    resumeText: `ALEX RIVERA
San Francisco, CA | (555) 382-9102 | alex.rivera.dev@example.com | github.com/alexrivera-dev

PROFESSIONAL SUMMARY
Results-driven Senior Full-Stack Engineer with 6+ years of experience architecting and delivering high-scale web platforms. Specialized in React, TypeScript, Node.js, and cloud microservices. Proven track record of improving system uptime to 99.95% and slashing API response times.

WORK EXPERIENCE

PulseTech Solutions — San Francisco, CA
Lead Full-Stack Engineer | March 2021 – Present
- Led a team of 5 engineers delivering a real-time analytics dashboard serving over 150,000 daily active enterprise users.
- Architected Node.js/Express and Next.js microservices hosted on AWS ECS, consistently achieving 99.95% uptime SLA.
- Reduced client-side JavaScript bundle sizes by 42% via code-splitting, tree-shaking, and lazy loading strategies.
- Implemented comprehensive CI/CD pipelines with automated end-to-end testing, accelerating deployment frequency by 3x.
- Mentored 4 engineers through weekly 1-on-1 code reviews and system architecture design sessions.

CloudVibe Media — Seattle, WA
Software Engineer | June 2018 – February 2021
- Migrated legacy monolithic Ruby on Rails backend to modular Node.js REST and GraphQL services with PostgreSQL.
- Implemented distributed Redis caching layer that decreased peak p99 API latency by 35%.
- Built responsive customer-facing web applications using React and Tailwind CSS, increasing mobile user engagement by 28%.
- Integrated Stripe billing and Webhook processing workflows with idempotent transaction handling.

TECHNICAL SKILLS
- Languages: TypeScript, JavaScript (ES6+), Python, SQL, HTML5/CSS3
- Frontend: React 18, Next.js, Redux Toolkit, Tailwind CSS, Webpack, Vite
- Backend: Node.js, Express, GraphQL, REST APIs, PostgreSQL, Redis, RabbitMQ (Basic)
- DevOps & Cloud: Docker, AWS (ECS, S3, RDS, CloudWatch), GitHub Actions, Jest

EDUCATION
B.S. in Computer Science — University of Washington (2018)
AWS Certified Developer – Associate (2022)`
  },
  {
    name: "Maya Chen",
    jobTitle: "Lead Product Manager (B2B SaaS)",
    roleDescription: "Drive product discovery, PLG funnels, enterprise pricing, and roadmaps for an AI analytics suite.",
    jobSpecText: `Job Title: Lead Product Manager - Enterprise SaaS
Department: Product Management
Seniority: Lead (6+ years)

About the Role:
We are looking for an entrepreneurial Lead Product Manager to spearhead our flagship AI Intelligence product suite. You will define the vision, execute product-led growth (PLG) strategies, and collaborate closely with engineering, design, and enterprise sales teams.

Key Responsibilities:
- Own the multi-quarter product roadmap from ideation and customer discovery through launch and optimization.
- Drive key North Star metrics: Net Revenue Retention (NRR), Daily Active Users (DAU), and trial-to-paid conversion rates.
- Partner with Enterprise Sales to design tiered pricing, packaging, and custom enterprise security capabilities (SSO, RBAC).
- Conduct weekly qualitative customer interviews and synthesize telemetry data (Mixpanel, Amplitude) into actionable feature specs.
- Lead agile rituals with engineering squads, managing sprint backlogs and release readiness.

Qualifications:
- 6+ years in product management with at least 3 years in high-growth B2B SaaS.
- Demonstrated success scaling a product from early PMF to $10M+ ARR.
- Strong quantitative acumen and mastery of product analytics tools.
- Experience with AI/ML-driven features or data-intensive workflows is a strong plus.`,
    resumeText: `MAYA CHEN
New York, NY | (555) 749-3019 | maya.chen.pm@example.com | linkedin.com/in/mayachen-pm

PROFESSIONAL SUMMARY
Impact-oriented Lead Product Manager with 7 years of experience scaling B2B enterprise software and PLG SaaS products. Passionate about marrying deep customer empathy with rigorous data analytics to drive multi-million dollar ARR growth.

EXPERIENCE

NovaData Technologies — New York, NY
Senior Product Manager | January 2021 – Present
- Owned the core reporting & workflow automation product lines, scaling ARR from $4.2M to $11.5M in 2.5 years.
- Redesigned the self-serve onboarding onboarding flow, driving a 34% increase in 14-day user activation and 22% improvement in trial conversions.
- Collaborated with 3 cross-functional engineering squads (18 engineers) across 2-week agile sprint cycles.
- Ran extensive customer discovery interviews with 80+ enterprise heads of analytics to define automated anomaly detection feature.

KiteFlow Inc. — Boston, MA
Product Manager | August 2017 – December 2020
- Launched collaborative workspace canvas product from MVP to 50k monthly active organizations.
- Implemented enterprise pricing tier that increased Average Contract Value (ACV) by 45%.
- Partnered with UX research to establish continuous usability testing lab and customer advisory board.

SKILLS & TOOLS
- Product Strategy, PLG Funnels, Enterprise SaaS, Customer Discovery, Agile/Scrum
- Analytics: Amplitude, Mixpanel, SQL (PostgreSQL), Tableau, Google Analytics
- Tools: Jira, Linear, Figma, Notion, Productboard

EDUCATION
B.A. in Economics & Human-Computer Interaction — Boston University (2017)
Pragmatic Institute Certified (PMC-III)`
  },
  {
    name: "Dr. Liam Vance",
    jobTitle: "Senior AI / ML Platform Engineer",
    roleDescription: "Deploy LLM inference pipelines, fine-tune open weights models, and optimize GPU cluster latency.",
    jobSpecText: `Job Title: Senior AI / ML Platform Engineer
Department: Machine Learning Systems
Seniority: Senior / Staff (4+ years post-grad or 6+ industry)

About the Role:
Join our Applied AI team to design and scale ultra-low-latency LLM inference architectures, model quantization pipelines, and retrieval-augmented generation (RAG) backends serving millions of inference calls daily.

Core Responsibilities:
- Build high-throughput LLM serving infrastructure using vLLM, TensorRT-LLM, and Triton Inference Server.
- Implement vector search architectures (Milvus / Qdrant / pgvector) with hybrid retrieval and reranking models.
- Optimize GPU memory footprint and latency via quantization (AWQ, FP8, INT4) and speculative decoding.
- Productionize distributed fine-tuning pipelines with PyTorch, DeepSpeed, and LoRA on multi-node GPU clusters.

Qualifications:
- 5+ years of ML systems engineering experience with PyTorch, CUDA, and distributed training/inference.
- Deep expertise in transformer architectures, LLM quantization, and serving engines.
- Strong software engineering foundation in Python and C++/Rust.
- Experience with Kubernetes GPU scheduling and monitoring.`
    ,
    resumeText: `DR. LIAM VANCE
Austin, TX | (555) 912-4028 | liam.vance.ai@example.com | github.com/liamvance-ml

SUMMARY
Senior ML Platform Engineer with deep expertise in LLM inference acceleration, distributed training, and RAG systems. Ph.D. in Computer Science with 5+ years in production AI engineering.

EXPERIENCE

ApexAI Labs — Austin, TX
Senior ML Systems Engineer | 2022 – Present
- Architected enterprise LLM inference gateway serving 12M daily requests across clustered NVIDIA H100/A100 GPUs using vLLM and TensorRT-LLM.
- Slashed time-to-first-token (TTFT) by 48% and cut GPU compute costs by 35% through FP8 quantization and prefix caching.
- Designed high-precision hybrid RAG pipeline with Qdrant vector database and cross-encoder reranking.
- Built automated continuous fine-tuning pipeline for domain-specific 70B parameter models using DeepSpeed ZeRO-3.

CognitiveCore — San Jose, CA
Machine Learning Engineer | 2019 – 2022
- Developed computer vision and NLP models for document intelligence in production pipelines.
- Accelerated PyTorch model inference by 3x utilizing ONNX Runtime and TensorRT optimizations.
- Deployed ML inference microservices on AWS EKS with autoscaling based on custom GPU telemetry.

EDUCATION
Ph.D. in Computer Science (Machine Learning) — UT Austin (2019)
B.S. in Electrical Engineering & CS — UC Berkeley (2015)

SKILLS
- PyTorch, CUDA, vLLM, TensorRT-LLM, DeepSpeed, HuggingFace, Triton
- Python, C++, CUDA C, SQL, Docker, Kubernetes, Slurm, Ray
- Vector DBs: Qdrant, Pinecone, pgvector, Milvus`
  }
];
