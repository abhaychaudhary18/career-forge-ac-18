import {
  BarChart3,
  Bell,
  Bot,
  Braces,
  Brain,
  Briefcase,
  CalendarCheck,
  FileText,
  FileSearch,
  Github,
  LayoutDashboard,
  ListChecks,
  PenLine,
  Route as RouteIcon,
  Settings,
  ShieldCheck,
  User,
  Shield,
} from "lucide-react";

export type NavItem = {
  label: string;
  to: string;
  icon: typeof LayoutDashboard;
  group: string;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard, group: "Overview" },
  { label: "Resume & ATS", to: "/resume", icon: FileText, group: "Profile intelligence" },
  { label: "Job Analyzer", to: "/job-analyzer", icon: FileSearch, group: "Profile intelligence" },
  { label: "Resume Builder", to: "/resume-builder", icon: PenLine, group: "Profile intelligence" },
  { label: "GitHub Analyzer", to: "/github", icon: Github, group: "Projects" },
  { label: "Project Defense", to: "/project-defense", icon: ShieldCheck, group: "Projects" },
  { label: "Mock Interview", to: "/interview", icon: Bot, group: "Practice" },
  { label: "Assessments", to: "/assessments", icon: Braces, group: "Practice" },
  { label: "Skill Verification", to: "/skills", icon: Brain, group: "Practice" },
  { label: "DSA & CS", to: "/dsa", icon: ListChecks, group: "Practice" },
  { label: "Career Roadmap", to: "/roadmap", icon: RouteIcon, group: "Plan" },
  { label: "Job Matcher", to: "/jobs", icon: Briefcase, group: "Plan" },
  { label: "Tasks", to: "/tasks", icon: CalendarCheck, group: "Plan" },
  { label: "Analytics", to: "/analytics", icon: BarChart3, group: "Insights" },
  { label: "Reports", to: "/reports", icon: Bell, group: "Insights" },
  { label: "Profile", to: "/profile", icon: User, group: "Account" },
  { label: "Settings", to: "/settings", icon: Settings, group: "Account" },
  { label: "Admin", to: "/admin", icon: Shield, group: "Account" },
];

export const NAV_GROUPS = [...new Set(NAV_ITEMS.map((i) => i.group))];
