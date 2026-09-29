# Career Compass AI

MASTER PROMPT — BUILD THE COMPLETE CAREER INTELLIGENCE PLATFORM

You are an expert full-stack engineer, UI/UX designer, AI engineer, DevOps engineer, database architect, and product engineer.

The application should provide a similar overall career-preparation experience, but it must be an ORIGINAL implementation with its own code, branding, assets, copy, and visual styling.

Do NOT copy source code, proprietary assets, logos, exact text, or copyrighted design assets from CareerPilot.

The platform should preserve the useful overall concept:

Resume → ATS Analysis → Resume Builder → Interview → Assessments → Career Roadmap → Task Tracking → Job Matching → Reports

BUT introduce a substantially stronger intelligence layer through:

GitHub Project Analyzer

AI Project Defense Simulator

Adaptive AI Interviewer

AI Job Readiness Gap Engine

Practical Skill Verification

Interview Weakness Heatmap

Career Intelligence Engine

The application should feel like a serious SaaS product that could be deployed publicly.

==================================================

1. PRODUCT NAME

==================================================

Use the product name:

CareerForge AI

Tagline:

"Turn Your Resume Into Career Readiness."

Do not use CareerPilot branding.

Create a professional logo using the text:

CareerForge AI

Use a simple modern AI/career-related icon.

==================================================

2. CORE PRODUCT IDEA

==================================================

CareerForge AI is an AI-powered career intelligence platform that continuously evaluates whether a candidate is actually ready for a specific job role.

The system should combine:

Resume
+
GitHub
+
Job Description
+
Coding Performance
+
Technical Knowledge
+
Mock Interview Performance
+
Communication Performance
+
Preparation Progress

to create a continuously updated:

CAREER READINESS PROFILE

The system should not behave like a collection of disconnected tools.

Everything must feed into a centralized Career Intelligence Engine.

==================================================

3. COLOR THEME

==================================================

Do NOT copy CareerPilot's colors.

Use a modern dark premium developer-focused theme.

Primary:

#0B1020

Secondary:

#111827

Card:

#151D2E

Primary accent:

#7C3AED

Secondary accent:

#06B6D4

Success:

#22C55E

Warning:

#F59E0B

Danger:

#EF4444

Text:

#F8FAFC

Secondary text:

#94A3B8

Borders:

#263247

Use gradients carefully.

Primary gradient:

Purple → Cyan

Use glassmorphism only where appropriate.

Do NOT overuse gradients.

Maintain excellent contrast and accessibility.

==================================================

4. DESIGN LANGUAGE

==================================================

Build a premium SaaS dashboard.

Design characteristics:

Dark mode first

Clean typography

Rounded cards

Subtle borders

Minimal shadows

Smooth animations

Responsive layout

Professional charts

Developer-oriented visual language

Clean spacing

High information density without clutter

Use:

Lucide icons

Recharts for charts

Framer Motion for animations

Tailwind CSS

Do not create excessive flashy animations.

The UI must look professional enough for a startup/product demo.

==================================================

5. TECH STACK

==================================================

Frontend:

React
TypeScript
Vite
Tailwind CSS
React Router
Framer Motion
Lucide React
Recharts
Monaco Editor

Backend:

Java 17+
Spring Boot
Spring Security
JWT authentication
REST APIs

Database:

MongoDB

Caching / temporary state:

Redis if useful.

AI:

Create an abstraction layer called:

AIService

so the AI provider can be changed easily.

Support:

Gemini API

with environment variable:

GEMINI_API_KEY

Do not hard-code API keys.

External APIs:

GitHub API
Job API such as Arbeitnow
Judge0 or another secure coding execution API
Speech-to-text API
Text-to-speech API where required

DevOps:

Docker
Docker Compose
GitHub Actions

==================================================

6. APPLICATION ARCHITECTURE

==================================================

Use this architecture:

Frontend
↓
Spring Boot REST API
↓
Service Layer
↓
AI Service
↓
MongoDB
↓
External APIs

Create clean separation between:

Controller
Service
Repository
DTO
Model
Security
Exception
Configuration

Use proper dependency injection.

Use global exception handling.

Use validation.

Use meaningful HTTP status codes.

==================================================

7. AUTHENTICATION

==================================================

Implement:

Register
Login
Logout
JWT authentication
Password hashing
Protected routes
Role-based authorization

Roles:

USER
ADMIN

User profile should contain:

name
email
profileImage
phone
location
targetRole
experienceLevel
skills
education
resumeId
githubUsername
linkedinUrl
portfolioUrl

==================================================

8. LANDING PAGE

==================================================

Create a premium landing page.

Sections:

Hero
Features
How It Works
AI Career Intelligence
GitHub Project Defense
Adaptive Interview
Job Matching
Career Readiness
Testimonials
FAQ
CTA
Footer

Hero:

Headline:

"Know Exactly How Ready You Are For Your Next Tech Role."

Subheading explaining:

Resume analysis
GitHub analysis
AI interviews
skill verification
job matching
personalized roadmap

CTA:

"Start Career Analysis"

Secondary CTA:

"Explore Features"

Add animated dashboard preview.

==================================================

9. MAIN DASHBOARD

==================================================

After login show:

Career Intelligence Dashboard

Top section:

Welcome, {name}

Target Role:
Software Engineer

Career Readiness Score:

86%

Show:

Resume Score
GitHub Score
Technical Score
Interview Score
Communication Score
Job Match Score

Example cards:

ATS Score
84%

GitHub Project Score
91%

Technical Readiness
78%

Interview Readiness
82%

Job Fit
88%

Overall Readiness
86%

Use animated circular progress indicators.

==================================================

10. CAREER READINESS ENGINE

==================================================

This is the central intelligence system.

Create:

CareerReadinessEngine

Inputs:

resume
skills
github
targetRole
jobDescription
codingScores
technicalScores
interviewScores
communicationScores
preparationProgress

Calculate:

resumeScore
technicalScore
codingScore
projectScore
communicationScore
interviewScore
jobFitScore
overallReadinessScore

Do NOT simply average everything.

Use configurable weighted scoring.

Store score history.

Show improvement over time.

==================================================

11. ATS RESUME ANALYZER

==================================================

Allow:

PDF upload
DOCX upload

Extract:

Name
Contact
Education
Experience
Projects
Skills
Certifications
Achievements

Analyze:

ATS compatibility
Keyword coverage
Skill relevance
Formatting
Missing sections
Action verbs
Project quality
Experience relevance

Show:

Overall ATS Score

Keyword Match

Missing Keywords

Missing Skills

Formatting Issues

Resume Strengths

AI Suggestions

==================================================

12. JOB DESCRIPTION ANALYZER

==================================================

Allow user to paste a job description.

AI extracts:

Job title
Required skills
Preferred skills
Experience
Education
Tools
Responsibilities
Keywords
Domain
Soft skills

Compare against user's resume.

Output:

Match percentage
Matched skills
Missing skills
Missing keywords
Experience gaps
Project gaps
Preparation requirements

==================================================

13. RESUME BUILDER

==================================================

Create a professional resume builder.

Sections:

Personal Information
Summary
Education
Experience
Projects
Skills
Certifications
Achievements
Coding Profiles

Provide templates:

Modern Tech
Classic Tech
Data Science
Software Engineer
Executive

Allow:

Live preview
Editing
AI rewrite
AI bullet improvement
Job-specific optimization

Export:

PDF
DOCX
LaTeX

==================================================

14. GITHUB PROJECT ANALYZER

==================================================

THIS IS ONE OF THE MOST IMPORTANT UNIQUE FEATURES.

Allow the user to connect:

GitHub username

or paste:

GitHub repository URL

Fetch repository information using GitHub API.

Analyze:

Repository name
README
Languages
Frameworks
Dependencies
File structure
Commit history
Contributors
Issues
Pull requests
Releases
Stars
Forks
Recent activity

Analyze project structure.

Identify:

Frontend
Backend
Database
APIs
Authentication
Deployment
Testing
CI/CD
Docker
Cloud
Architecture

AI should generate:

Project Overview

Architecture Explanation

Technology Stack

Strengths

Weaknesses

Code Quality Observations

Documentation Quality

Engineering Practices

Potential Interview Questions

Potential Resume Improvements

==================================================

15. PROJECT ARCHITECTURE ANALYZER

==================================================

Generate a visual architecture diagram.

Example:

React
↓
Spring Boot
↓
MongoDB

Show:

Frontend
Backend
Database
External APIs
Authentication
Deployment

Use React Flow or another diagram library.

Allow:

Zoom
Pan
Node details

AI should explain every component.

==================================================

16. AI PROJECT DEFENSE SIMULATOR

==================================================

THIS MUST BE A MAJOR FEATURE.

The user selects one of their GitHub projects.

AI becomes:

"Technical Interviewer"

The system analyzes the project before asking questions.

Question categories:

Project Overview
Architecture
Technology Choices
Database
APIs
Authentication
Security
Scalability
Performance
Testing
Deployment
Docker
CI/CD
Failure Handling
Future Improvements

Interview should be dynamic.

Do NOT use a fixed question sequence.

==================================================

17. ADAPTIVE INTERVIEW ENGINE

==================================================

The next question must depend on:

Previous answer
Answer quality
Confidence
Technical accuracy
Difficulty
Project context

Example:

Strong answer
→ harder follow-up

Average answer
→ clarification question

Weak answer
→ fundamental question

Incorrect answer
→ concept-check question

This creates:

Adaptive Interview Tree

instead of:

Question 1 → Question 2 → Question 3

==================================================

18. VOICE INTERVIEW

==================================================

Support:

Microphone input

Speech-to-text

AI analysis

Optional text-to-speech interviewer.

Interview interface:

AI Avatar
Question
Timer
Microphone
Live transcript
Submit Answer
Skip
End Interview

Analyze:

Technical Accuracy
Communication
Fluency
Clarity
Confidence indicators
Answer relevance
Depth
Structure

Do not claim medical/emotional conclusions.

Use only observable speech/answer characteristics.

==================================================

19. PROJECT DEFENSE SCORING

==================================================

After interview show:

Project Understanding
Architecture Knowledge
Technical Depth
Problem Solving
Security Awareness
Scalability Understanding
Communication
Ownership

Show:

Overall Project Defense Score

Generate:

Strengths
Weak Areas
Questions to Revise
Recommended Topics

==================================================

20. PRACTICAL SKILL VERIFICATION

==================================================

Instead of asking:

"Do you know Python?"

actually test it.

Create Skill Verification.

Categories:

Python
Java
C++
JavaScript
SQL
React
Spring Boot
Node.js
Docker
Git
Data Structures
Machine Learning

For each skill generate:

MCQs
Debugging questions
Output prediction
Coding problems
Scenario questions

Example:

Skill:
SQL

Test:

Easy
Medium
Hard

At the end:

Verified Skill Score

Store:

claimedSkill
verifiedSkill
confidenceLevel

Example:

Python:

Claimed: Advanced

Verified: Intermediate

This information feeds into CareerReadinessEngine.

==================================================

21. CODING ASSESSMENT

==================================================

Integrate Monaco Editor.

Support:

C++
Java
Python
JavaScript

Features:

Run
Submit
Test Cases
Hidden Test Cases
Execution Time
Memory
Compilation Errors
Runtime Errors

Use Judge0 or another secure external execution service.

Never execute arbitrary code directly on the Spring Boot server.

==================================================

22. FULL MOCK ASSESSMENT

==================================================

Create full placement assessment.

Sections:

Technical
Aptitude
Verbal
Coding

Example:

Technical: 60
Aptitude: 15
Verbal: 15
Coding: 2

Allow configurable numbers.

Difficulty:

Easy
Medium
Hard

Show:

Timer
Question navigation
Mark for review
Submit

Final report:

Accuracy
Time management
Weak topics
Strong topics
Coding performance

==================================================

23. CS PREPARATION

==================================================

Create:

DSA
OS
DBMS
SQL
OOP
Computer Networks
System Design

DSA patterns:

Arrays
Strings
Hashing
Two Pointers
Sliding Window
Stack
Queue
Binary Search
Linked List
Trees
Graphs
Heap
Greedy
Backtracking
Dynamic Programming

Track topic progress.

==================================================

24. ADAPTIVE LEARNING

==================================================

If user repeatedly fails:

Binary Search

system should recommend:

Binary Search revision
→ Easy questions
→ Medium questions
→ Hard questions
→ Mini assessment

The roadmap should dynamically change according to performance.

==================================================

25. INTERVIEW WEAKNESS HEATMAP

==================================================

Track interview performance over time.

Create heatmap:

Technical
Communication
DSA
DBMS
OS
CN
System Design
Projects
Behavioral

Color intensity represents weakness/frequency of mistakes.

Example:

DBMS
████████

System Design
██████

OOP
██

Click a topic to see:

Previous questions
Wrong answers
Correct answers
AI explanation
Recommended resources
Future practice questions

==================================================

26. CAREER ROADMAP GENERATOR

==================================================

User chooses:

Target Role

Examples:

Software Engineer
Backend Developer
Frontend Developer
Data Analyst
Data Scientist
ML Engineer
DevOps Engineer

System analyzes:

Current skills
Resume
GitHub
Verified skills
Job description
Interview performance

Generate:

30-day roadmap
60-day roadmap
90-day roadmap

Each roadmap contains:

Topics
Projects
Coding practice
CS subjects
Interview preparation
Certifications where appropriate
Milestones

==================================================

27. CAREER INTELLIGENCE ENGINE

==================================================

Central module:

CareerIntelligenceEngine

It should combine:

ResumeAnalyzer
GitHubAnalyzer
SkillVerifier
JobAnalyzer
InterviewAnalyzer
CodingAnalyzer
RoadmapEngine

Output:

Career Readiness Profile

Example:

Candidate:

Software Engineer

Overall:
86%

Resume:
84%

Technical:
78%

Coding:
88%

GitHub:
91%

Interview:
82%

Communication:
83%

Job Fit:
88%

==================================================

28. LIVE JOB MATCHING

==================================================

Integrate a job API such as Arbeitnow.

Display:

Job title
Company
Location
Remote status
Required skills
Experience
Salary when available
Application link

Allow filters:

Role
Location
Remote
Experience
Technology
Salary

For every job calculate:

Job Match %

based on:

Resume
Verified Skills
GitHub Skills
Target Role
Job Requirements

Show:

96% Match

Matched Skills:

Java
Spring Boot
MongoDB
Docker

Missing:

Kubernetes
AWS

==================================================

29. COMPANY-SPECIFIC PREPARATION

==================================================

When a user selects a job:

Create:

"Prepare for this Job"

Generate:

Required skills
Missing skills
Likely technical topics
Likely DSA topics
CS subjects
Project questions
Behavioral questions
Mock interview
Skill tests

Create:

Company Preparation Dashboard

==================================================

30. TASK TRACKER

==================================================

Create:

Daily Tasks
Weekly Goals
Calendar
Study Timer
Streak
Progress

Tasks can automatically come from the roadmap.

Example:

Monday:

Solve 3 binary search problems

Tuesday:

Revise DBMS indexing

Wednesday:

Complete SQL verification test

Thursday:

Project defense

==================================================

31. AI STUDY PLANNER

==================================================

Allow the user to say:

"I have 2 hours today."

AI should generate:

2-hour study plan

based on:

Weaknesses
Upcoming interviews
Target role
Current roadmap
Recent performance

==================================================

32. CAREER REPORT

==================================================

Generate downloadable PDF.

Sections:

Candidate Overview
Resume Analysis
ATS Score
Skill Analysis
GitHub Analysis
Verified Skills
Interview Performance
Coding Performance
Weakness Heatmap
Job Match Analysis
Career Roadmap
Recommended Actions

Use professional report design.

==================================================

33. PROFILE PAGE

==================================================

Display:

Profile
Resume
Skills
Verified Skills
GitHub
LinkedIn
Portfolio
Target Role
Education
Experience

Allow editing.

==================================================

34. HISTORY

==================================================

Maintain historical records for:

Resume scans
ATS scores
Mock interviews
Coding tests
Skill verification
Project defenses
Job matches
Career readiness scores

Display charts showing progress.

==================================================

35. ADMIN PANEL

==================================================

Create admin dashboard.

Admin can see:

Users
Assessments
Questions
Reports
Jobs
System statistics
AI usage

Admin can:

Create questions
Edit questions
Delete questions
Create categories
Manage users
Manage reports

==================================================

36. DATABASE DESIGN

==================================================

Create MongoDB collections:

users
resumes
resumeAnalyses
jobs
jobAnalyses
githubRepositories
githubAnalyses
skills
skillTests
skillResults
interviews
interviewQuestions
interviewAnswers
codingTests
codingSubmissions
roadmaps
tasks
progress
careerScores
reports
notifications

Use proper references/IDs.

Add createdAt and updatedAt timestamps.

==================================================

37. BACKEND API

==================================================

Create REST APIs.

Authentication:

POST /api/auth/register
POST /api/auth/login

Resume:

POST /api/resume/upload
POST /api/resume/analyze
GET /api/resume/history

Jobs:

GET /api/jobs
POST /api/jobs/analyze

GitHub:

POST /api/github/analyze
GET /api/github/projects
GET /api/github/project/{id}

Interview:

POST /api/interview/start
POST /api/interview/answer
POST /api/interview/next-question
POST /api/interview/end
GET /api/interview/{id}/report

Skill:

POST /api/skills/test
POST /api/skills/submit
GET /api/skills/results

Coding:

POST /api/coding/run
POST /api/coding/submit

Roadmap:

POST /api/roadmap/generate
GET /api/roadmap

Career Intelligence:

GET /api/career/readiness
GET /api/career/history
GET /api/career/heatmap

Reports:

POST /api/reports/generate
GET /api/reports/{id}

Tasks:

GET /api/tasks
POST /api/tasks
PUT /api/tasks/{id}
DELETE /api/tasks/{id}

==================================================

38. AI PROMPT ARCHITECTURE

==================================================

Never scatter AI prompts throughout controllers.

Create:

AIService

and specialized services:

ResumeAIService
InterviewAIService
GitHubAIService
CareerAIService
JobAIService
SkillAIService
RoadmapAIService

Store prompts separately.

Use structured JSON output whenever possible.

Validate AI responses before storing them.

==================================================

39. AI SAFETY / RELIABILITY

==================================================

Never blindly trust AI output.

Validate:

JSON
scores
required fields
ranges

Scores must remain:

0–100

If AI fails:

return a graceful error.

Do not expose API keys to frontend.

==================================================

40. RESPONSIVE UI

==================================================

The entire platform must work on:

Desktop
Tablet
Mobile

Desktop dashboard:

Sidebar
Top navigation
Main content

Mobile:

Bottom navigation or collapsible sidebar.

==================================================

41. DASHBOARD SIDEBAR

==================================================

Use:

Dashboard
Resume
Job Analyzer
Resume Builder
GitHub Analyzer
Project Defense
Mock Interview
Assessments
Skill Verification
DSA & CS
Career Roadmap
Job Matcher
Tasks
Analytics
Reports
Profile
Settings

==================================================

42. NOTIFICATIONS

==================================================

Create notification system.

Examples:

"Your GitHub analysis is complete."

"Your interview weakness in DBMS has increased."

"You have 3 recommended tasks today."

"A new 92% matching job was found."

"Your Career Readiness improved by 6%."

==================================================

43. SEARCH

==================================================

Global search.

Search:

Jobs
Skills
Projects
Questions
Roadmap topics
Reports

==================================================

44. PERFORMANCE

==================================================

Use:

Lazy loading
Pagination
Caching
Debouncing
Optimized API calls
Image optimization

Do not load all jobs at once.

==================================================

45. SECURITY

==================================================

Implement:

JWT
BCrypt
CORS
Input validation
Rate limiting where appropriate
Secure file upload validation
Maximum upload size
API authorization
Environment variables
No secret keys in GitHub

GitHub tokens must never be stored insecurely.

==================================================

46. ERROR HANDLING

==================================================

Create professional error UI.

Examples:

Network error
AI unavailable
GitHub API limit
Invalid resume
Unsupported file
Coding execution failure
Job API failure

Never show raw stack traces to users.

==================================================

47. EMPTY STATES

==================================================

Create useful empty states.

Example:

No GitHub repository connected.

Show:

"Connect GitHub to analyze your projects and generate project-specific interview questions."

CTA:

Connect GitHub

==================================================

48. LOADING STATES

==================================================

Use skeleton loaders.

AI analysis should show stages:

Analyzing Resume
Extracting Skills
Comparing Job Requirements
Generating Recommendations

GitHub:

Fetching Repository
Analyzing Structure
Analyzing Technologies
Generating Questions

==================================================

49. GAMIFICATION

==================================================

Use subtle gamification.

Show:

Career XP
Preparation streak
Completed tasks
Verified skills
Interview badges

Example badges:

First Interview
Resume Optimized
GitHub Verified
10 DSA Problems
Project Defense Complete

Do not make the platform look childish.

==================================================

50. DARK DASHBOARD VISUALIZATION

==================================================

Use charts:

Career score trend
Skill radar
Interview performance
Job match distribution
Preparation activity
Weakness heatmap

Use Recharts.

==================================================

51. SETTINGS

==================================================

Settings:

Profile
Security
Notifications
AI preferences
Target roles
Connected accounts
GitHub
Theme
Data export
Delete account

==================================================

52. DATA PRIVACY

==================================================

Clearly explain:

Resume data
GitHub data
Interview recordings
Assessment results

Provide:

Delete data option
Export data option

Do not expose private GitHub repository data publicly.

==================================================

53. DEMO MODE

==================================================

Create demo/sample data so the entire dashboard can be demonstrated without API keys.

Demo user:

Alex Johnson

Target:

Software Engineer

Demo repository:

AI Code Mentor

Demo scores:

ATS 86
GitHub 91
Technical 79
Coding 88
Interview 84
Job Fit 89
Overall 86

Make it obvious that demo data is sample data.

==================================================

54. PROJECT STRUCTURE

==================================================

Frontend:

src/
components/
pages/
layouts/
hooks/
services/
context/
utils/
types/
charts/
features/

Backend:

src/main/java/
controller/
service/
repository/
model/
dto/
security/
config/
exception/
ai/
github/
jobs/
interview/
resume/
career/

==================================================

55. DEVOPS

==================================================

Create:

Dockerfile frontend
Dockerfile backend
docker-compose.yml

Services:

frontend
backend
mongodb
redis if required

Create:

.github/workflows/

with:

CI
Build
Test

Use Java 17 and modern Node LTS.

==================================================

56. ENVIRONMENT VARIABLES

==================================================

Create:

.env.example

Include:

MONGODB_URI=
JWT_SECRET=
GEMINI_API_KEY=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
ARBEITNOW_API_URL=
JUDGE0_URL=
SPEECH_API_KEY=

Never commit actual secrets.

==================================================

57. TESTING

==================================================

Create backend unit tests for:

Authentication
Resume analysis
Skill scoring
Job matching
Career readiness
Interview scoring

Frontend tests for:

Login
Dashboard
Resume upload
GitHub analysis
Interview
Job matching

==================================================

58. README

==================================================

Create a detailed README containing:

Project overview
Features
Architecture
Tech stack
Folder structure
Setup
Environment variables
Running locally
Docker setup
API documentation
Database structure
AI architecture
GitHub integration
Job API integration
Deployment

==================================================

59. FINAL USER FLOW

==================================================

A new user should experience:

Register

Create profile

Upload resume

Select target role

Analyze resume

Connect GitHub

Analyze projects

Paste target job description

Generate skill-gap analysis

Take skill verification

Take coding assessment

Start adaptive interview

Perform project defense

Receive weakness heatmap

Generate career roadmap

Receive personalized preparation tasks

Browse matching jobs

Prepare for selected jobs

Retake assessments

Watch Career Readiness score improve

==================================================

60. MOST IMPORTANT DIFFERENTIATOR

==================================================

Do NOT build the platform as separate pages with unrelated AI features.

The following data must continuously interact:

RESUME
↓
SKILLS
↓
GITHUB
↓
VERIFIED SKILLS
↓
JOB REQUIREMENTS
↓
SKILL GAP
↓
ROADMAP
↓
TASKS
↓
CODING PERFORMANCE
↓
INTERVIEW PERFORMANCE
↓
PROJECT DEFENSE
↓
WEAKNESS HEATMAP
↓
CAREER READINESS SCORE

Every completed activity should potentially update the candidate's readiness profile.

Example:

User fails DBMS questions.

System:

Updates DBMS weakness

Updates Career Readiness

Adds DBMS revision task

Adds SQL practice

Adjusts roadmap

Generates DBMS interview questions

Updates heatmap

Recommends another verification test

This feedback loop is the heart of the application.

==================================================

61. IMPORTANT UI REQUIREMENT

==================================================

Keep the UI polished from the beginning.

Do not create a plain CRUD dashboard.

Use:

Professional typography

Consistent spacing

Responsive cards

Charts

Animated transitions

Skeleton loaders

Empty states

Error states

Tooltips

Confirmation dialogs

Toast notifications

Keyboard-friendly controls

==================================================

62. IMPLEMENTATION RULE

==================================================

Build the application incrementally but ensure all modules are connected.

First establish:

Authentication
Database
Dashboard
Navigation
Design system

Then:

Resume
Job Analyzer
GitHub Analyzer

Then:

Project Defense
Adaptive Interview
Skill Verification

Then:

Assessments
Roadmap
Task Tracker

Then:

Job Matcher
Analytics
Reports

Then:

Testing
Docker
CI/CD
Deployment readiness

Do not leave fake buttons.

Every major button should either:

Work

Open the correct page

Trigger the appropriate API

Clearly show "Coming Soon" if the functionality genuinely cannot be implemented yet.

==================================================

63. QUALITY BAR

==================================================

The finished application should look like a real SaaS startup product.

It should NOT look like:

A college CRUD project

A generic ChatGPT wrapper

A template dashboard

A static HTML website

A collection of disconnected pages

The final product should demonstrate:

Full-stack engineering
AI integration
Data analysis
GitHub API integration
Job API integration
Coding evaluation
Voice interaction
Adaptive systems
Recommendation systems
Analytics
DevOps
Database design
Security

==================================================

64. START BUILDING

==================================================

Start by:

Creating the project structure.

Installing dependencies.

Creating the design system.

Building authentication.

Building the dashboard shell.

Building MongoDB models.

Creating backend REST APIs.

Implementing frontend routing.

Implementing Resume Analyzer.

Implementing GitHub Analyzer.

Implementing Project Defense.

Implementing Adaptive Interview.

Implementing Skill Verification.

Implementing Career Intelligence Engine.

Implementing Job Matcher.

Implementing Roadmap.

Implementing Task Tracker.

Implementing Analytics.

Implementing Reports.

Adding Docker.

Adding GitHub Actions.

Testing the entire application.

Fixing all errors.

Ensuring responsive design.

Providing final setup instructions.

Before considering the project complete, verify that:

Frontend builds successfully.

Backend builds successfully.

MongoDB connection works.

Authentication works.

Protected routes work.

Resume upload works.

AI integration has graceful fallback.

GitHub analysis works.

Job matching works.

Adaptive interview works.

Coding assessment works.

Career readiness score updates.

Dashboard charts display real stored data.

Docker Compose starts successfully.

No secrets are committed.

No major buttons are non-functional.

Mobile UI works.

Do not stop after generating the UI.

Implement the actual backend, database models, API integrations, AI service layer, business logic, and connected workflows.

The final result should be a complete, coherent, production-style AI Career Intelligence Platform.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://career-forge-ac-18.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d2078868-9bac-55e4-94fd-fa69a5613c23).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
