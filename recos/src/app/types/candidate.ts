export interface Skill {
  name: string;
  match: number;
}

export interface AIAnalysis {
  problemSolving: number;
  python: number;
  machineLearning: number;
  overall: number;
}

export interface PerformanceItem {
  name: string;
  value: 'High' | 'Medium' | 'Low';
}

export interface Candidate {
  id: string;
  name: string;
  position: string;
  initialMatch: number;
  finalMatch: number;
  about: string;
  skills: Skill[];
  aiAnalysis: AIAnalysis;
  interviewPerformance: PerformanceItem[];
}

export interface MenuItem {
  name: string;
  icon: string;
}