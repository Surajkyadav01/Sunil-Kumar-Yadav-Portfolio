export interface PersonalInfo {
  name: string;
  title: string;
  location: string;
  expertise: string;
  email: string;
  phone: string;
  profileImg: string;
  aboutMe: string;
}

export interface SocialLinks {
  github: string;
  globe: string;
  linkedin: string;
  instagram: string;
  facebook: string;
  whatsapp: string;
}

export interface SkillItem {
  name: string;
  percentage: number;
}

export interface SkillCategory {
  title: string;
  items: SkillItem[];
}

export interface ToolItem {
  id: string;
  name: string;
  logo: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  link: string;
  description: string;
}

export interface PortfolioData {
  personalInfo: PersonalInfo;
  socials: SocialLinks;
  skillCategories: SkillCategory[];
  tools: ToolItem[];
  certificates: string[];
  projects: ProjectItem[];
  hobbies: string[];
  resumeUrl: string;
}
