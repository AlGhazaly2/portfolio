
export interface Project {
  title: string;
  description: string;
  technologies: string[];
  category: 'web' | 'mobile' | 'software';
  image: string;
  link?: string;
}

export interface Skill {
  name: string;
  level: number;
  category: 'frontend' | 'backend' | 'tools' | 'other';
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string[];
}

export interface Education {
  school: string;
  degree: string;
  year: string;
}
