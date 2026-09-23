import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { AIError, generateJson, safeList, safeScore } from "@/lib/ai.server";

function fail(error: unknown): never {
  if (error instanceof AIError) throw new Error(error.message);
  console.error(error);
  throw new Error(error instanceof Error ? error.message : "Something went wrong. Please try again.");
}

/* ------------------------------------------------------------------ resume */

export const analyzeResume = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ text: z.string().min(50), targetRole: z.string().default("Software Engineer") }).parse(d),
  )
  .handler(async ({ data }) => {
    try {
      const out = await generateJson<Record<string, unknown>>({
        system:
          "You are an expert technical recruiter and ATS engine. Judge resumes strictly and concretely. Never invent facts that are not in the resume.",
        prompt: `Target role: ${data.targetRole}\n\nResume text:\n${data.text.slice(0, 15000)}\n\nReturn JSON with keys: atsScore (0-100), keywordMatch (0-100), summary (string), extracted {name, email, phone, location, education[], experience[], projects[], skills[], certifications[], achievements[]}, missingKeywords[], missingSkills[], formattingIssues[], strengths[], suggestions[], sectionsMissing[], actionVerbQuality (0-100), projectQuality (0-100), experienceRelevance (0-100).`,
      });
      return {
        atsScore: safeScore(out["atsScore"]),
        keywordMatch: safeScore(out["keywordMatch"]),
        summary: String(out["summary"] ?? ""),
        extracted: (out["extracted"] ?? {}) as Record<string, unknown>,
        missingKeywords: safeList(out["missingKeywords"]),
        missingSkills: safeList(out["missingSkills"]),
        formattingIssues: safeList(out["formattingIssues"]),
        strengths: safeList(out["strengths"]),
        suggestions: safeList(out["suggestions"]),
        sectionsMissing: safeList(out["sectionsMissing"]),
        actionVerbQuality: safeScore(out["actionVerbQuality"]),
        projectQuality: safeScore(out["projectQuality"]),
        experienceRelevance: safeScore(out["experienceRelevance"]),
      };
    } catch (e) {
      fail(e);
    }
  });

/* --------------------------------------------------------------------- job */

export const analyzeJob = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        description: z.string().min(40),
        resumeText: z.string().default(""),
        skills: z.array(z.string()).default([]),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    try {
      const out = await generateJson<Record<string, unknown>>({
        system: "You compare a candidate profile against a job description like a hiring manager. Be specific and honest about gaps.",
        prompt: `Job description:\n${data.description.slice(0, 12000)}\n\nCandidate resume:\n${data.resumeText.slice(0, 10000)}\n\nCandidate declared skills: ${data.skills.join(", ") || "none provided"}\n\nReturn JSON: {jobTitle, company, seniority, domain, matchScore (0-100), requiredSkills[], preferredSkills[], tools[], responsibilities[], keywords[], softSkills[], matchedSkills[], missingSkills[], missingKeywords[], experienceGaps[], projectGaps[], preparationPlan[]}.`,
      });
      return {
        jobTitle: String(out["jobTitle"] ?? "Role"),
        company: String(out["company"] ?? ""),
        seniority: String(out["seniority"] ?? ""),
        domain: String(out["domain"] ?? ""),
        matchScore: safeScore(out["matchScore"]),
        requiredSkills: safeList(out["requiredSkills"]),
        preferredSkills: safeList(out["preferredSkills"]),
        tools: safeList(out["tools"]),
        responsibilities: safeList(out["responsibilities"]),
        keywords: safeList(out["keywords"], 40),
        softSkills: safeList(out["softSkills"]),
        matchedSkills: safeList(out["matchedSkills"]),
        missingSkills: safeList(out["missingSkills"]),
        missingKeywords: safeList(out["missingKeywords"], 40),
        experienceGaps: safeList(out["experienceGaps"]),
        projectGaps: safeList(out["projectGaps"]),
        preparationPlan: safeList(out["preparationPlan"], 15),
      };
    } catch (e) {
      fail(e);
    }
  });

/* ------------------------------------------------------------------ github */

type Repo = {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  updated_at: string;
};

async function gh<T>(path: string): Promise<T> {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: { Accept: "application/vnd.github+json", "User-Agent": "CareerForgeAI" },
  });
  if (res.status === 404) throw new Error("That GitHub user or repository could not be found.");
  if (res.status === 403) throw new Error("GitHub is rate limiting requests right now. Try again shortly.");
  if (!res.ok) throw new Error("GitHub could not be reached. Try again shortly.");
  return (await res.json()) as T;
}

export const listGithubRepos = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ username: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    try {
      const repos = await gh<Repo[]>(`/users/${encodeURIComponent(data.username)}/repos?per_page=100&sort=updated`);
      return repos.map((r) => ({
        name: r.name,
        fullName: r.full_name,
        url: r.html_url,
        description: r.description,
        language: r.language,
        stars: r.stargazers_count,
        forks: r.forks_count,
        issues: r.open_issues_count,
        updatedAt: r.updated_at,
      }));
    } catch (e) {
      fail(e);
    }
  });

export const analyzeGithubRepo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ repo: z.string().min(3) }).parse(d))
  .handler(async ({ data }) => {
    try {
      const slug = data.repo
        .replace(/^https?:\/\/github\.com\//i, "")
        .replace(/\.git$/, "")
        .replace(/\/$/, "");
      if (!/^[\w.-]+\/[\w.-]+$/.test(slug)) throw new Error("Enter a repository as owner/name or a GitHub URL.");

      const [repo, languages, contents, commits] = await Promise.all([
        gh<Repo>(`/repos/${slug}`),
        gh<Record<string, number>>(`/repos/${slug}/languages`).catch(() => ({})),
        gh<{ name: string; type: string }[]>(`/repos/${slug}/contents`).catch(() => []),
        gh<{ commit: { message: string; author: { date: string } } }[]>(`/repos/${slug}/commits?per_page=20`).catch(() => []),
      ]);

      let readme = "";
      try {
        const rm = await gh<{ content?: string }>(`/repos/${slug}/readme`);
        if (rm.content) readme = atob(rm.content.replace(/\n/g, "")).slice(0, 8000);
      } catch {
        readme = "";
      }

      const files = contents.map((c) => `${c.name}${c.type === "dir" ? "/" : ""}`);
      const out = await generateJson<Record<string, unknown>>({
        system:
          "You are a staff engineer reviewing a candidate's repository for an interview. Base every statement on the evidence provided. Say plainly when evidence is missing.",
        prompt: `Repository: ${repo.full_name}\nDescription: ${repo.description ?? "none"}\nStars: ${repo.stargazers_count}, forks: ${repo.forks_count}, open issues: ${repo.open_issues_count}\nLanguages: ${Object.keys(languages).join(", ") || "unknown"}\nTop-level files: ${files.join(", ") || "unknown"}\nRecent commit messages: ${commits.slice(0, 15).map((c) => c.commit.message.split("\n")[0]).join(" | ")}\nREADME:\n${readme}\n\nReturn JSON: {score (0-100), overview, architectureExplanation, techStack[], components: [{name, layer, description}], strengths[], weaknesses[], codeQuality[], documentationQuality (0-100), engineeringPractices[], hasTests (bool), hasCI (bool), hasDocker (bool), hasAuth (bool), deployment, interviewQuestions[], resumeBullets[]}.`,
      });

      const components = Array.isArray(out["components"])
        ? (out["components"] as Record<string, unknown>[]).slice(0, 12).map((c) => ({
            name: String(c["name"] ?? ""),
            layer: String(c["layer"] ?? "service"),
            description: String(c["description"] ?? ""),
          }))
        : [];

      return {
        repoName: repo.full_name,
        repoUrl: repo.html_url,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        issues: repo.open_issues_count,
        languages,
        score: safeScore(out["score"]),
        overview: String(out["overview"] ?? ""),
        architectureExplanation: String(out["architectureExplanation"] ?? ""),
        techStack: safeList(out["techStack"], 30),
        components,
        strengths: safeList(out["strengths"]),
        weaknesses: safeList(out["weaknesses"]),
        codeQuality: safeList(out["codeQuality"]),
        documentationQuality: safeScore(out["documentationQuality"]),
        engineeringPractices: safeList(out["engineeringPractices"]),
        hasTests: Boolean(out["hasTests"]),
        hasCI: Boolean(out["hasCI"]),
        hasDocker: Boolean(out["hasDocker"]),
        hasAuth: Boolean(out["hasAuth"]),
        deployment: String(out["deployment"] ?? "unknown"),
        interviewQuestions: safeList(out["interviewQuestions"], 15),
        resumeBullets: safeList(out["resumeBullets"], 10),
      };
    } catch (e) {
      fail(e);
    }
  });

/* --------------------------------------------------------------- interview */

const turnSchema = z.object({
  question: z.string(),
  answer: z.string(),
  score: z.number().nullable().optional(),
  category: z.string().optional(),
});

export const nextInterviewQuestion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        mode: z.enum(["technical", "behavioral", "project-defense"]).default("technical"),
        role: z.string().default("Software Engineer"),
        context: z.string().default(""),
        weakTopics: z.array(z.string()).default([]),
        history: z.array(turnSchema).default([]),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    try {
      const transcript = data.history
        .map((t, i) => `Q${i + 1} (${t.category ?? "general"}): ${t.question}\nA: ${t.answer}\nScore: ${t.score ?? "n/a"}`)
        .join("\n\n");

      const out = await generateJson<Record<string, unknown>>({
        system: `You are an adaptive technical interviewer for a ${data.role} role. The next question must depend on the last answer: strong answer -> harder follow-up; average -> clarification; weak -> fundamentals; incorrect -> concept check. Never repeat a question.`,
        prompt: `Interview mode: ${data.mode}\nContext the interview is grounded in:\n${data.context.slice(0, 6000) || "none"}\nKnown weak topics: ${data.weakTopics.join(", ") || "none"}\n\nTranscript so far:\n${transcript || "none — this is the first question"}\n\nReturn JSON: {question, category, difficulty ("easy"|"medium"|"hard"), rationale, expectedPoints[]}.`,
      });

      return {
        question: String(out["question"] ?? "Tell me about a project you built and the hardest decision in it."),
        category: String(out["category"] ?? "general"),
        difficulty: String(out["difficulty"] ?? "medium"),
        rationale: String(out["rationale"] ?? ""),
        expectedPoints: safeList(out["expectedPoints"], 8),
      };
    } catch (e) {
      fail(e);
    }
  });

export const evaluateAnswer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        question: z.string(),
        answer: z.string(),
        category: z.string().default("general"),
        context: z.string().default(""),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    try {
      const out = await generateJson<Record<string, unknown>>({
        system:
          "You grade interview answers. Judge only observable qualities of the answer: technical accuracy, depth, structure, relevance and clarity of expression. Do not infer emotional or medical states.",
        prompt: `Context:\n${data.context.slice(0, 4000)}\n\nQuestion (${data.category}): ${data.question}\nAnswer: ${data.answer.slice(0, 6000) || "(no answer given)"}\n\nReturn JSON: {score (0-100), technicalAccuracy (0-100), depth (0-100), structure (0-100), relevance (0-100), communication (0-100), verdict ("strong"|"average"|"weak"|"incorrect"), feedback, missedPoints[], modelAnswer}.`,
      });
      return {
        score: safeScore(out["score"]),
        technicalAccuracy: safeScore(out["technicalAccuracy"]),
        depth: safeScore(out["depth"]),
        structure: safeScore(out["structure"]),
        relevance: safeScore(out["relevance"]),
        communication: safeScore(out["communication"]),
        verdict: String(out["verdict"] ?? "average"),
        feedback: String(out["feedback"] ?? ""),
        missedPoints: safeList(out["missedPoints"], 8),
        modelAnswer: String(out["modelAnswer"] ?? ""),
      };
    } catch (e) {
      fail(e);
    }
  });

export const summariseInterview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ mode: z.string().default("technical"), history: z.array(turnSchema).default([]) }).parse(d),
  )
  .handler(async ({ data }) => {
    try {
      const transcript = data.history.map((t, i) => `Q${i + 1}: ${t.question}\nA: ${t.answer}\nScore: ${t.score ?? "n/a"}`).join("\n\n");
      const out = await generateJson<Record<string, unknown>>({
        system: "You write concise, honest interview debriefs for candidates.",
        prompt: `Mode: ${data.mode}\nTranscript:\n${transcript}\n\nReturn JSON: {overall (0-100), scores: {projectUnderstanding, architecture, technicalDepth, problemSolving, security, scalability, communication, ownership} each 0-100, strengths[], weakAreas[], questionsToRevise[], recommendedTopics[], weakTopics[]}.`,
      });
      const s = (out["scores"] ?? {}) as Record<string, unknown>;
      return {
        overall: safeScore(out["overall"]),
        scores: {
          projectUnderstanding: safeScore(s["projectUnderstanding"]),
          architecture: safeScore(s["architecture"]),
          technicalDepth: safeScore(s["technicalDepth"]),
          problemSolving: safeScore(s["problemSolving"]),
          security: safeScore(s["security"]),
          scalability: safeScore(s["scalability"]),
          communication: safeScore(s["communication"]),
          ownership: safeScore(s["ownership"]),
        },
        strengths: safeList(out["strengths"]),
        weakAreas: safeList(out["weakAreas"]),
        questionsToRevise: safeList(out["questionsToRevise"], 10),
        recommendedTopics: safeList(out["recommendedTopics"], 10),
        weakTopics: safeList(out["weakTopics"], 10),
      };
    } catch (e) {
      fail(e);
    }
  });

/* ------------------------------------------------------------------ skills */

export const generateSkillTest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        skill: z.string().min(1),
        difficulty: z.enum(["easy", "medium", "hard", "mixed"]).default("mixed"),
        count: z.number().min(3).max(12).default(8),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    try {
      const out = await generateJson<Record<string, unknown>>({
        system: "You write practical skill verification tests for engineers. Mix MCQs, output prediction, debugging and scenario questions. Exactly one correct option each.",
        prompt: `Skill: ${data.skill}. Difficulty: ${data.difficulty}. Produce ${data.count} questions.\nReturn JSON: {questions: [{id, type ("mcq"|"output"|"debug"|"scenario"), difficulty, topic, prompt, code, options[4], answerIndex (0-3), explanation}]}.`,
      });
      const raw = Array.isArray(out["questions"]) ? (out["questions"] as Record<string, unknown>[]) : [];
      const questions = raw
        .filter((q) => Array.isArray(q["options"]) && (q["options"] as unknown[]).length >= 2)
        .slice(0, data.count)
        .map((q, i) => ({
          id: String(q["id"] ?? i + 1),
          type: String(q["type"] ?? "mcq"),
          difficulty: String(q["difficulty"] ?? "medium"),
          topic: String(q["topic"] ?? data.skill),
          prompt: String(q["prompt"] ?? ""),
          code: String(q["code"] ?? ""),
          options: (q["options"] as unknown[]).slice(0, 4).map((o) => String(o)),
          answerIndex: Math.max(0, Math.min(3, Number(q["answerIndex"] ?? 0))),
          explanation: String(q["explanation"] ?? ""),
        }));
      if (!questions.length) throw new Error("The AI could not generate a valid test. Please try again.");
      return { questions };
    } catch (e) {
      fail(e);
    }
  });

/* ------------------------------------------------------------------ coding */

export const reviewCodeSubmission = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        title: z.string(),
        statement: z.string(),
        language: z.string(),
        code: z.string().min(1),
        tests: z.array(z.object({ input: z.string(), expected: z.string() })).default([]),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    try {
      const out = await generateJson<Record<string, unknown>>({
        system:
          "You are a code judge. Trace the submitted code against each test case and report whether it would produce the expected output. Do not execute anything; reason statically and be strict.",
        prompt: `Problem: ${data.title}\n${data.statement}\n\nLanguage: ${data.language}\nSubmission:\n${data.code.slice(0, 8000)}\n\nTest cases: ${JSON.stringify(data.tests).slice(0, 4000)}\n\nReturn JSON: {compiles (bool), compileError, results: [{input, expected, actual, passed}], passed (int), total (int), score (0-100), timeComplexity, spaceComplexity, review[], improvements[]}.`,
      });
      const results = Array.isArray(out["results"])
        ? (out["results"] as Record<string, unknown>[]).map((r) => ({
            input: String(r["input"] ?? ""),
            expected: String(r["expected"] ?? ""),
            actual: String(r["actual"] ?? ""),
            passed: Boolean(r["passed"]),
          }))
        : [];
      return {
        compiles: out["compiles"] !== false,
        compileError: String(out["compileError"] ?? ""),
        results,
        passed: results.filter((r) => r.passed).length,
        total: results.length || data.tests.length,
        score: safeScore(out["score"]),
        timeComplexity: String(out["timeComplexity"] ?? ""),
        spaceComplexity: String(out["spaceComplexity"] ?? ""),
        review: safeList(out["review"], 10),
        improvements: safeList(out["improvements"], 10),
      };
    } catch (e) {
      fail(e);
    }
  });

/* ----------------------------------------------------------------- roadmap */

export const generateRoadmap = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        targetRole: z.string(),
        profileSummary: z.string().default(""),
        weakTopics: z.array(z.string()).default([]),
        missingSkills: z.array(z.string()).default([]),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    try {
      const out = await generateJson<Record<string, unknown>>({
        system: "You build realistic, week-by-week preparation roadmaps for engineers targeting a specific role.",
        prompt: `Target role: ${data.targetRole}\nProfile signals:\n${data.profileSummary.slice(0, 6000)}\nWeak topics: ${data.weakTopics.join(", ") || "unknown"}\nMissing skills: ${data.missingSkills.join(", ") || "unknown"}\n\nReturn JSON: {phases: [{horizon ("30"|"60"|"90"), focus, topics[], projects[], codingPractice[], csSubjects[], interviewPrep[], certifications[], milestones[]}], immediateTasks: [{title, description, category}]}.`,
      });
      const phases = Array.isArray(out["phases"])
        ? (out["phases"] as Record<string, unknown>[]).map((p) => ({
            horizon: String(p["horizon"] ?? "30"),
            focus: String(p["focus"] ?? ""),
            topics: safeList(p["topics"], 15),
            projects: safeList(p["projects"], 8),
            codingPractice: safeList(p["codingPractice"], 12),
            csSubjects: safeList(p["csSubjects"], 10),
            interviewPrep: safeList(p["interviewPrep"], 10),
            certifications: safeList(p["certifications"], 5),
            milestones: safeList(p["milestones"], 8),
          }))
        : [];
      const immediateTasks = Array.isArray(out["immediateTasks"])
        ? (out["immediateTasks"] as Record<string, unknown>[]).slice(0, 12).map((t) => ({
            title: String(t["title"] ?? ""),
            description: String(t["description"] ?? ""),
            category: String(t["category"] ?? "general"),
          }))
        : [];
      return { phases, immediateTasks };
    } catch (e) {
      fail(e);
    }
  });

export const generateStudyPlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        minutes: z.number().min(15).max(600),
        weakTopics: z.array(z.string()).default([]),
        targetRole: z.string().default("Software Engineer"),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    try {
      const out = await generateJson<Record<string, unknown>>({
        system: "You are a study planner. Build a realistic, time-boxed plan that fits exactly the available time.",
        prompt: `Available time: ${data.minutes} minutes. Target role: ${data.targetRole}. Weakest topics: ${data.weakTopics.join(", ") || "unknown"}.\nReturn JSON: {blocks: [{minutes, title, detail, category}], summary}.`,
      });
      const blocks = Array.isArray(out["blocks"])
        ? (out["blocks"] as Record<string, unknown>[]).slice(0, 10).map((b) => ({
            minutes: Math.max(5, Math.min(240, Number(b["minutes"] ?? 30))),
            title: String(b["title"] ?? ""),
            detail: String(b["detail"] ?? ""),
            category: String(b["category"] ?? "general"),
          }))
        : [];
      return { blocks, summary: String(out["summary"] ?? "") };
    } catch (e) {
      fail(e);
    }
  });

/* -------------------------------------------------------------------- jobs */

export const fetchJobs = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ query: z.string().default(""), page: z.number().min(1).max(10).default(1) }).parse(d),
  )
  .handler(async ({ data }) => {
    try {
      const url = new URL("https://www.arbeitnow.com/api/job-board-api");
      url.searchParams.set("page", String(data.page));
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error("The job feed is unavailable right now. Please try again later.");
      const json = (await res.json()) as {
        data: {
          slug: string;
          title: string;
          company_name: string;
          location: string;
          remote: boolean;
          url: string;
          tags: string[];
          job_types: string[];
          description: string;
          created_at: number;
        }[];
      };
      const q = data.query.trim().toLowerCase();
      return json.data
        .filter((j) => !q || `${j.title} ${j.company_name} ${j.tags.join(" ")}`.toLowerCase().includes(q))
        .slice(0, 40)
        .map((j) => ({
          slug: j.slug,
          title: j.title,
          company: j.company_name,
          location: j.location,
          remote: j.remote,
          url: j.url,
          tags: (j.tags ?? []).slice(0, 12),
          jobTypes: j.job_types ?? [],
          description: (j.description ?? "").replace(/<[^>]+>/g, " ").slice(0, 1200),
          createdAt: j.created_at,
        }));
    } catch (e) {
      fail(e);
    }
  });

/* ----------------------------------------------------------------- reports */

export const generateCareerReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ profileSummary: z.string().min(10) }).parse(d))
  .handler(async ({ data }) => {
    try {
      const out = await generateJson<Record<string, unknown>>({
        system: "You write professional, concise career readiness reports for engineers. Base every claim on the supplied data.",
        prompt: `Candidate data:\n${data.profileSummary.slice(0, 12000)}\n\nReturn JSON: {headline, candidateOverview, resumeAnalysis, skillAnalysis, githubAnalysis, interviewPerformance, codingPerformance, weaknessSummary, jobMatchAnalysis, roadmapSummary, recommendedActions[]}.`,
      });
      return {
        headline: String(out["headline"] ?? "Career readiness report"),
        candidateOverview: String(out["candidateOverview"] ?? ""),
        resumeAnalysis: String(out["resumeAnalysis"] ?? ""),
        skillAnalysis: String(out["skillAnalysis"] ?? ""),
        githubAnalysis: String(out["githubAnalysis"] ?? ""),
        interviewPerformance: String(out["interviewPerformance"] ?? ""),
        codingPerformance: String(out["codingPerformance"] ?? ""),
        weaknessSummary: String(out["weaknessSummary"] ?? ""),
        jobMatchAnalysis: String(out["jobMatchAnalysis"] ?? ""),
        roadmapSummary: String(out["roadmapSummary"] ?? ""),
        recommendedActions: safeList(out["recommendedActions"], 12),
      };
    } catch (e) {
      fail(e);
    }
  });

/* ------------------------------------------------------- resume generation */

export const improveResumeSection = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ section: z.string(), content: z.string().min(3), targetRole: z.string().default("Software Engineer") }).parse(d),
  )
  .handler(async ({ data }) => {
    try {
      const out = await generateJson<Record<string, unknown>>({
        system: "You rewrite resume content into strong, quantified, ATS-friendly bullets. Never invent metrics that are not implied.",
        prompt: `Target role: ${data.targetRole}\nSection: ${data.section}\nContent:\n${data.content.slice(0, 4000)}\n\nReturn JSON: {rewritten, bullets[], notes[]}.`,
      });
      return {
        rewritten: String(out["rewritten"] ?? ""),
        bullets: safeList(out["bullets"], 10),
        notes: safeList(out["notes"], 6),
      };
    } catch (e) {
      fail(e);
    }
  });
