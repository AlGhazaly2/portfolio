// Database using JSON file storage
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize database if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
    const initialData = {
        admin_users: [
            {
                id: 1,
                username: 'admin',
                password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // admin123
                email: 'admin@portfolio.com'
            }
        ],
        projects: [
            {
                id: 1,
                title: "Plateforme d'Inscription Étudiant",
                description: "Développement d'un site permettant l'inscription et la gestion des étudiants. Comprend un formulaire sécurisé, un CRUD complet et un dashboard admin.",
                technologies: ["PHP", "MySQL", "HTML", "CSS", "JS"],
                category: "web",
                image_url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80",
                github_link: null
            },
            {
                id: 2,
                title: "Application de Gestion Scolaire",
                description: "Développement d'une application mobile pour la gestion scolaire native. Intégration en temps réel des données académiques.",
                technologies: ["XML", "JAVA", "FIREBASE"],
                category: "software",
                image_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80",
                github_link: "https://github.com/laajaj0/AppEcig"
            }
        ],
        education: [
            {
                id: 1,
                school: "IBN TOFAIL KENITRA",
                degree: "Licence Création du Contenu Numérique",
                year: "2024 – 2025",
                display_order: 1
            },
            {
                id: 2,
                school: "ISTA Sidi Kacem",
                degree: "Développement Digital",
                year: "2022 – 2024",
                display_order: 2
            },
            {
                id: 3,
                school: "LYCEE LOUIS LE CHATELIER SIDI SLIMANE",
                degree: "Baccalauréat Science Mathématique",
                year: "2019 – 2020",
                display_order: 3
            }
        ],
        experiences: [
            {
                id: 1,
                company: "ECIG (École Centrale d'Informatique et de Gestion)",
                role: "Stagiaire Développeur",
                period: "10/03/2024 – 20/04/2024",
                description: ["Développement de modules internes", "Assistance technique et maintenance informatique"],
                display_order: 1
            }
        ],
        messages: [],
        skills: [
            { id: 1, name: "HTML / CSS", level: 95, category: "frontend" },
            { id: 2, name: "JavaScript", level: 85, category: "frontend" },
            { id: 3, name: "PHP", level: 85, category: "backend" },
            { id: 4, name: "MySQL", level: 85, category: "backend" },
            { id: 5, name: "Java", level: 80, category: "backend" },
            { id: 6, name: "XML", level: 75, category: "other" },
            { id: 7, name: "Bootstrap", level: 90, category: "frontend" },
            { id: 8, name: "GitHub", level: 80, category: "tools" },
            { id: 9, name: "VS Code", level: 90, category: "tools" },
            { id: 10, name: "XAMPP", level: 85, category: "tools" },
            { id: 11, name: "Word", level: 90, category: "other" },
            { id: 12, name: "Excel", level: 85, category: "other" },
            { id: 13, name: "PowerPoint", level: 85, category: "other" },
            { id: 14, name: "Canva", level: 75, category: "other" }
        ],
        languages: [
            { id: 1, name: "Arabe", level: "Langue maternelle", display_order: 1 },
            { id: 2, name: "Français", level: "Bon niveau", display_order: 2 },
            { id: 3, name: "Anglais", level: "Intermédiaire", display_order: 3 }
        ],
        interests: [
            { id: 1, name: "Voyage", display_order: 1 },
            { id: 2, name: "Musique", display_order: 2 },
            { id: 3, name: "Sport", display_order: 3 },
            { id: 4, name: "Jeux vidéo", display_order: 4 }
        ]
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
}

// Read database
export function readDB() {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
}

// Write database
export function writeDB(data: any) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Get next ID for a table
export function getNextId(table: string): number {
    const db = readDB();
    const items = db[table] || [];
    if (items.length === 0) return 1;
    return Math.max(...items.map((item: any) => item.id)) + 1;
}
