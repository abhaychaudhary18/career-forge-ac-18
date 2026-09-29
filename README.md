AI-powered career readiness platform for resume analysis, project
understanding, skill verification, adaptive interviews, coding
practice, job matching, and personalized career preparation.

<img width="2501" height="1422" alt="image" src="https://github.com/user-attachments/assets/f7fbbfdf-9701-48ef-818f-a9ea6507bab5" />







📌 Overview

CareerForge AI is a full-stack career-readiness platform designed to
turn candidate information into a structured, continuously improving
career profile.

Instead of treating a resume, GitHub profile, interview performance,
coding performance, and job requirements as separate pieces of
information, CareerForge combines them into one feedback loop:

Analyze → Assess → Detect Gaps → Adapt → Practice → Re-assess

✨ Core Features

📄 AI Resume / ATS Analysis

Resume parsing and structured profile extraction

ATS-oriented analysis

Skill and keyword identification

Resume improvement recommendations

Resume-to-job requirement comparison

🧑‍💻 GitHub Project Analysis

GitHub repository analysis

Project structure and technology inspection

Repository-aware project understanding

Technical project evaluation

Project-defense question generation

🛡️ AI Project Defense

CareerForge can use project context to generate technical questions
around architecture, technology choices, APIs, database design,
authentication, deployment, trade-offs, and implementation decisions.

🎯 Skill Verification

Assessment results can be converted into evidence-based skill signals
for skill-level tracking, weakness identification, and personalized
preparation.

🎤 Adaptive AI Interview

Interview flows can use candidate profile, resume, project information,
skill signals, previous answers, and weakness topics to create
personalized technical interviews.

💻 Coding Assessment

Coding-oriented assessment flows and submission tracking contribute to
the candidate's technical readiness profile.

🔎 Job Analyzer & Job Matching

Job requirements can be analyzed against candidate capabilities to
identify matched skills, missing skills, and role-specific preparation
gaps.

🗺️ Personalized Roadmap

Assessment and interview outcomes can feed a preparation roadmap
containing skill gaps, priority topics, practice tasks, and preparation
goals.

📊 Career Intelligence Dashboard

The intelligence layer combines: - Resume - Project - Technical -
Coding - Interview - Communication - Job Fit

into a unified readiness model.

🖼️ Architecture Overview



High-level view of the frontend, application layer, AI/integration services, career intelligence, and data layer.

🏗️ System Architecture

flowchart TB
    U[Candidate] --> FE[React + TypeScript Frontend]

    FE --> AUTH[Authentication]
    FE --> RESUME[Resume Analysis]
    FE --> GH[GitHub Analysis]
    FE --> INTERVIEW[AI Interview]
    FE --> CODE[Coding Assessment]
    FE --> JOB[Job Analyzer]
    FE --> SKILL[Skill Verification]
    FE --> ROADMAP[Roadmap]
    FE --> INTEL[Intelligence Dashboard]

    AUTH --> SB[(Supabase)]
    RESUME --> API[Application / Server Layer]
    GH --> API
    INTERVIEW --> API
    CODE --> API
    JOB --> API
    SKILL --> API

    API --> AI[AI / LLM Services]
    API --> GHA[GitHub API]
    API --> DB[(Supabase Database)]

    RESUME --> DB
    GH --> DB
    INTERVIEW --> DB
    CODE --> DB
    JOB --> DB
    SKILL --> DB
    ROADMAP --> DB
    INTEL --> DB

    DB --> INTEL
    INTEL --> ROADMAP
    INTEL --> FE

🔄 Career Intelligence Loop

flowchart LR
    A[Candidate Data] --> B[Analyze]
    B --> C[Assess]
    C --> D[Detect Weakness]
    D --> E[Adapt]
    E --> F[Practice]
    F --> G[Re-test]
    G --> C

    D --> H[Personalized Roadmap]
    H --> F

🧠 Adaptive Interview Architecture

sequenceDiagram
    participant C as Candidate
    participant UI as Interview UI
    participant APP as Application Layer
    participant DB as Supabase
    participant AI as AI/LLM

    C->>UI: Start interview
    UI->>APP: Candidate + interview context
    APP->>DB: Load profile / skills / project data
    DB-->>APP: Candidate context
    APP->>AI: Generate contextual question
    AI-->>APP: Question
    APP-->>UI: Display question
    C->>UI: Submit answer
    UI->>APP: Answer + question context
    APP->>AI: Evaluate answer
    AI-->>APP: Evaluation + topic signals
    APP->>DB: Store interview outcome
    APP->>AI: Generate next adaptive question
    AI-->>APP: Follow-up question
    APP-->>UI: Next question

📄 Resume Analysis Flow

flowchart LR
    A[Resume PDF/DOCX] --> B[File Processing]
    B --> C[Text Extraction]
    C --> D[Structured Resume Data]
    D --> E[ATS Analysis]
    E --> F[Skill Extraction]
    F --> G[Recommendations]
    G --> H[(Supabase)]
    H --> I[Dashboard]

🧑‍💻 GitHub Project Defense Flow

flowchart LR
    A[GitHub Repository URL] --> B[GitHub API]
    B --> C[Repository Metadata]
    B --> D[Source / Project Context]
    C --> E[Project Analysis]
    D --> E
    E --> F[AI Technical Understanding]
    F --> G[Defense Questions]
    G --> H[Candidate Answers]
    H --> I[AI Evaluation]
    I --> J[Weakness / Skill Signals]
    J --> K[(Supabase)]

🎯 Job Matching Flow

flowchart LR
    A[Candidate Profile] --> C[Skill Normalization]
    B[Job Description] --> D[Requirement Extraction]
    C --> E[Skill Matching Engine]
    D --> E
    E --> F[Matched Skills]
    E --> G[Missing Skills]
    E --> H[Role-specific Gaps]
    F --> I[Career Intelligence]
    G --> I
    H --> I
    I --> J[Preparation Roadmap]

📊 Readiness Model

The current implementation uses these readiness signals and weights:

Signal            Weight

Resume               15%
Project              18%
Technical            18%
Coding               16%
Interview            16%
Communication         7%
Job Fit              10%

The implementation renormalizes available weights when some signals are
unavailable.

These weights describe the current implementation; they are not an
industry-standard definition of career readiness.

🗄️ Data Architecture

erDiagram
    PROFILE ||--o{ RESUME_ANALYSIS : has
    PROFILE ||--o{ GITHUB_ANALYSIS : has
    PROFILE ||--o{ JOB_ANALYSIS : has
    PROFILE ||--o{ SKILL_RESULT : receives
    PROFILE ||--o{ INTERVIEW : completes
    PROFILE ||--o{ CODING_SUBMISSION : submits
    PROFILE ||--o{ WEAKNESS_TOPIC : develops
    PROFILE ||--o{ CAREER_SCORE : receives

    PROFILE {
        uuid id
        string name
        string email
    }

    RESUME_ANALYSIS {
        uuid id
        uuid user_id
        float score
    }

    GITHUB_ANALYSIS {
        uuid id
        uuid user_id
        string repository
    }

    JOB_ANALYSIS {
        uuid id
        uuid user_id
        string role
    }

    SKILL_RESULT {
        uuid id
        uuid user_id
        string skill
        float score
    }

    INTERVIEW {
        uuid id
        uuid user_id
        string type
        float score
    }

    CODING_SUBMISSION {
        uuid id
        uuid user_id
        string language
        float score
    }

    WEAKNESS_TOPIC {
        uuid id
        uuid user_id
        string topic
        float mastery
    }

    CAREER_SCORE {
        uuid id
        uuid user_id
        float readiness
    }

Conceptual representation of the application's data domains. The exact
Supabase schema may contain additional fields and relationships.

⚙️ Technology Stack

Frontend

React 19

TypeScript

Vite

TanStack Router / Start

Tailwind CSS

React Query

Monaco Editor

Framer Motion

Recharts

Zod

Backend / Application Layer

TanStack Start / Nitro

Server-side TypeScript

REST/API integrations

Supabase server integration

AI / Intelligence

LLM-based analysis

Resume evaluation

Project understanding

Technical question generation

Answer evaluation

Skill-gap detection

Data & Integrations

Supabase

GitHub API

PDF.js

Mammoth

Zod

DevOps

Git

GitHub

Bun

ESLint

GitHub Actions

Cloudflare Workers

Wrangler

Nitro deployment

Environment variables / secrets

Cloudflare Logs / Observability

🚀 DevOps & Deployment Architecture

flowchart LR
    DEV[Developer] --> GIT[Git]
    GIT --> GH[GitHub Repository]
    GH --> CI[Build / CI Pipeline]
    CI --> INSTALL[bun install]
    INSTALL --> LINT[Lint]
    LINT --> BUILD[bun run build]
    BUILD --> NITRO[Nitro Prebuilt Output]
    NITRO --> CF[Cloudflare Workers]
    CF --> APP[CareerForge AI]
    APP --> SUPA[Supabase]
    CF --> LOGS[Cloudflare Logs]
    CF --> TRACE[Observability / Traces]
    LOGS --> DEBUG[Production Debugging]
    TRACE --> DEBUG

Current commands

Development:

bun run dev

Production build:

bun run build

Production preview:

npx vite preview

Nitro prebuilt deployment:

npx nitro deploy --prebuilt

🔐 Environment Variables

Create a local .env file:

SUPABASE_URL=your_supabase_project_url
SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

Security

.env is excluded from Git tracking.

Never commit API keys or service-role credentials.

Never expose SUPABASE_SERVICE_ROLE_KEY to client-side code.

Configure production secrets through the hosting provider's
secret/environment-variable system.

🛠️ Local Development

Prerequisites

Node.js

Bun

Git

Supabase project

GitHub/API access where required

Clone

git clone https://github.com/abhaychaudhary18/career-forge-ac-18.git
cd career-forge-ac-18

Install

bun install

Configure environment

Create .env and configure the required Supabase variables.

Start development server

bun run dev

Open the local URL printed by Vite, typically:

http://localhost:8080

Build

bun run build

Lint

bun run lint

📁 Project Structure

career-forge-ac-18/
│
├── src/
│   ├── components/
│   │   ├── app/
│   │   ├── brand/
│   │   ├── site/
│   │   └── ui/
│   │
│   ├── hooks/
│   │
│   ├── integrations/
│   │   ├── lovable/
│   │   └── supabase/
│   │
│   ├── lib/
│   │   ├── admin.functions.ts
│   │   ├── ai.functions.ts
│   │   ├── ai.server.ts
│   │   ├── career-engine.ts
│   │   ├── data.ts
│   │   ├── resume-parse.ts
│   │   └── ...
│   │
│   ├── routes/
│   │   ├── auth.tsx
│   │   ├── _authenticated/
│   │   └── ...
│   │
│   ├── router.tsx
│   ├── routeTree.gen.ts
│   ├── server.ts
│   └── start.ts
│
├── public/
├── package.json
├── bun.lock
├── bunfig.toml
└── vite.config.*

🧩 Engineering Highlights

Modular architecture

UI
 ↓
Route / Feature
 ↓
Application Logic
 ↓
AI / Integration Layer
 ↓
Database

Signal-based readiness

Resume ───────┐
Project ──────┤
Technical ────┤
Coding ───────┤
Interview ────┼──> Career Intelligence
Communication ┤
Job Fit ──────┘
                     │
                     ▼
                Readiness
                     │
                     ▼
                 Skill Gaps
                     │
                     ▼
                  Roadmap

Repository-aware AI

Project context can be supplied to AI workflows so technical questions
can be grounded in the candidate's actual project instead of relying
only on generic interview questions.

🔭 Future Improvements

Automated unit and integration test coverage

Stronger GitHub Actions CI/CD gates

Docker-based development and deployment

AWS deployment option

Infrastructure as Code with Terraform

More granular skill evidence tracking

Evaluation calibration and quality monitoring

Longitudinal candidate analytics

Background processing for expensive AI operations

Rate limiting and abuse protection

Production-grade alerting

🎓 Why CareerForge AI?

CareerForge connects:

Resume
   +
Projects
   +
Skills
   +
Coding
   +
Interviews
   +
Job Requirements
        ↓
Career Intelligence
        ↓
Skill Gaps
        ↓
Personalized Practice
        ↓
Re-assessment

The goal is a continuous preparation workflow rather than a one-time
resume evaluation.

👨‍💻 Author

Abhay Chaudhary

B.Tech CSE --- Data Science
Lovely Professional University

GitHub: https://github.com/abhaychaudhary18

LinkedIn: https://www.linkedin.com/in/abhay-chaudhary042/

📜 License

Add the license that matches how you intend to distribute the project.

⭐ Project Status

Active development

CareerForge AI is being developed as a full-stack AI career-readiness
platform focused on practical software engineering, AI-assisted
analysis, adaptive assessment, and cloud deployment.
