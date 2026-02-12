
import { Project, Skill, Experience, Education } from './types';

export const PROJECTS: Project[] = [
  {
    title: "Plateforme d’Inscription Étudiant",
    description: "Développement d’un site permettant l'inscription et la gestion des étudiants. Comprend un formulaire sécurisé, un CRUD complet et un dashboard admin.",
    technologies: ["PHP", "MySQL", "HTML", "CSS", "JS"],
    category: "web",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80"
  },
  {
    title: "Application de Gestion Scolaire",
    description: "Développement d’une application mobile pour la gestion scolaire native. Intégration en temps réel des données académiques.",
    technologies: ["XML", "JAVA", "FIREBASE"],
    category: "software",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80",
    link: "https://github.com/laajaj0/AppEcig"
  }
];

export const SKILLS: Skill[] = [
  { name: "HTML / CSS", level: 95, category: "frontend" },
  { name: "JavaScript", level: 85, category: "frontend" },
  { name: "PHP", level: 85, category: "backend" },
  { name: "MySQL", level: 85, category: "backend" },
  { name: "Java", level: 80, category: "backend" },
  { name: "XML", level: 75, category: "other" },
  { name: "Bootstrap", level: 90, category: "frontend" },
  { name: "GitHub", level: 80, category: "tools" },
  { name: "VS Code", level: 90, category: "tools" },
  { name: "XAMPP", level: 85, category: "tools" },
  { name: "Word", level: 90, category: "other" },
  { name: "Excel", level: 85, category: "other" },
  { name: "PowerPoint", level: 85, category: "other" },
  { name: "Canva", level: 75, category: "other" }
];

export const EXPERIENCES: Experience[] = [
  {
    company: "ECIG (École Centrale d'Informatique et de Gestion)",
    role: "Stagiaire Développeur",
    period: "10/03/2024 – 20/04/2024",
    description: [
      "Développement de modules internes",
      "Assistance technique et maintenance informatique"
    ]
  }
];

export const EDUCATION: Education[] = [
  {
    school: "IBN TOFAIL KENITRA",
    degree: "Licence Création du Contenu Numérique",
    year: "2024 – 2025"
  },
  {
    school: "ISTA Sidi Kacem",
    degree: "Développement Digital",
    year: "2022 – 2024"
  },
  {
    school: "LYCEE LOUIS LE CHATELIER SIDI SLIMANE",
    degree: "Baccalauréat Science Mathématique",
    year: "2019 – 2020"
  }
];

export const LANGUAGES = [
  { name: "Arabe", level: "Langue maternelle" },
  { name: "Français", level: "Bon niveau" },
  { name: "Anglais", level: "Intermédiaire" }
];

export const INTERESTS = [
  { id: 1, name: "Voyage" },
  { id: 2, name: "Musique" },
  { id: 3, name: "Sport" },
  { id: 4, name: "Jeux vidéo" }
];
