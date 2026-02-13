
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Enable UUID extension if needed, though Serial is fine for simple use cases

    // 1. Admin Users Table
    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL
      );
    `;

    // 2. Profile Table
    await sql`
      CREATE TABLE IF NOT EXISTS profile (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        title VARCHAR(255),
        subtitle TEXT,
        status VARCHAR(255),
        image_url VARCHAR(255)
      );
    `;

    // 3. Projects Table
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        technologies TEXT[],
        category VARCHAR(50),
        image_url VARCHAR(255),
        github_link VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 4. Education Table
    await sql`
      CREATE TABLE IF NOT EXISTS education (
        id SERIAL PRIMARY KEY,
        school VARCHAR(255) NOT NULL,
        degree VARCHAR(255) NOT NULL,
        year VARCHAR(50),
        display_order INTEGER DEFAULT 0
      );
    `;

    // 5. Experiences Table
    await sql`
      CREATE TABLE IF NOT EXISTS experiences (
        id SERIAL PRIMARY KEY,
        company VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        period VARCHAR(100),
        description TEXT[],
        display_order INTEGER DEFAULT 0
      );
    `;

    // 6. Skills Table
    await sql`
      CREATE TABLE IF NOT EXISTS skills (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        level INTEGER DEFAULT 50,
        category VARCHAR(50)
      );
    `;

    // 7. Languages Table
    await sql`
      CREATE TABLE IF NOT EXISTS languages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        level VARCHAR(100),
        display_order INTEGER DEFAULT 0
      );
    `;

    // 8. Interests Table
    await sql`
      CREATE TABLE IF NOT EXISTS interests (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        display_order INTEGER DEFAULT 0
      );
    `;

    // 9. Messages Table
    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_read BOOLEAN DEFAULT FALSE
      );
    `;

    // 10. Seed Initial Data (Only if empty)

    // Check if profile exists
    const { rows: profileRows } = await sql`SELECT * FROM profile LIMIT 1`;
    if (profileRows.length === 0) {
      await sql`
        INSERT INTO profile (name, title, subtitle, status, image_url)
        VALUES (
          'Ahmed Al Ghazaly', 
          'Développeur Informatique', 
          'Développeur informatique spécialisé en développement web et applications mobiles avec une forte capacité d''analyse et de conception de solutions digitales fiables, performantes et évolutives.', 
          'Disponible pour nouveaux projets', 
          NULL
        );
      `;
    }

    // Check if admin user exists
    const { rows: userRows } = await sql`SELECT * FROM admin_users LIMIT 1`;
    if (userRows.length === 0) {
      // Password: admin123 (hashed)
      await sql`
        INSERT INTO admin_users (username, password, email)
        VALUES ('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@portfolio.com');
      `;
    }

    // Seed Projects if empty
    const { rows: projectRows } = await sql`SELECT * FROM projects LIMIT 1`;
    if (projectRows.length === 0) {
      await sql`
                INSERT INTO projects (title, description, technologies, category, image_url, github_link) VALUES 
                ('Plateforme d’Inscription Étudiant', 'Développement d’un site permettant l''inscription et la gestion des étudiants. Comprend un formulaire sécurisé, un CRUD complet et un dashboard admin.', ARRAY['PHP', 'MySQL', 'HTML', 'CSS', 'JS'], 'web', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80', NULL),
                ('Application de Gestion Scolaire', 'Développement d’une application mobile pour la gestion scolaire native. Intégration en temps réel des données académiques.', ARRAY['XML', 'JAVA', 'FIREBASE'], 'software', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80', 'https://github.com/laajaj0/AppEcig');
            `;
    }

    // Seed Skills if empty
    const { rows: skillRows } = await sql`SELECT * FROM skills LIMIT 1`;
    if (skillRows.length === 0) {
      await sql`
                INSERT INTO skills (name, level, category) VALUES 
                ('HTML / CSS', 95, 'frontend'),
                ('JavaScript', 85, 'frontend'),
                ('PHP', 85, 'backend'),
                ('MySQL', 85, 'backend'),
                ('Java', 80, 'backend'),
                ('XML', 75, 'other'),
                ('Bootstrap', 90, 'frontend'),
                ('GitHub', 80, 'tools'),
                ('VS Code', 90, 'tools'),
                ('XAMPP', 85, 'tools'),
                ('Word', 90, 'other'),
                ('Excel', 85, 'other'),
                ('PowerPoint', 85, 'other'),
                ('Canva', 75, 'other');
            `;
    }

    // Seed Experiences if empty
    const { rows: expRows } = await sql`SELECT * FROM experiences LIMIT 1`;
    if (expRows.length === 0) {
      await sql`
                INSERT INTO experiences (company, role, period, description, display_order) VALUES 
                ('ECIG (École Centrale d''Informatique et de Gestion)', 'Stagiaire Développeur', '10/03/2024 – 20/04/2024', ARRAY['Développement de modules internes', 'Assistance technique et maintenance informatique'], 0);
            `;
    }

    // Seed Education if empty
    const { rows: eduRows } = await sql`SELECT * FROM education LIMIT 1`;
    if (eduRows.length === 0) {
      await sql`
                INSERT INTO education (school, degree, year, display_order) VALUES 
                ('IBN TOFAIL KENITRA', 'Licence Création du Contenu Numérique', '2024 – 2025', 0),
                ('ISTA Sidi Kacem', 'Développement Digital', '2022 – 2024', 1),
                ('LYCEE LOUIS LE CHATELIER SIDI SLIMANE', 'Baccalauréat Science Mathématique', '2019 – 2020', 2);
            `;
    }

    // Seed Languages if empty
    const { rows: langRows } = await sql`SELECT * FROM languages LIMIT 1`;
    if (langRows.length === 0) {
      await sql`
                INSERT INTO languages (name, level, display_order) VALUES 
                ('Arabe', 'Langue maternelle', 0),
                ('Français', 'Bon niveau', 1),
                ('Anglais', 'Intermédiaire', 2);
            `;
    }

    // Seed Interests if empty
    const { rows: intRows } = await sql`SELECT * FROM interests LIMIT 1`;
    if (intRows.length === 0) {
      await sql`
                INSERT INTO interests (name, display_order) VALUES 
                ('Voyage', 0),
                ('Musique', 1),
                ('Sport', 2),
                ('Jeux vidéo', 3);
            `;
    }


    return NextResponse.json({ success: true, message: 'Database initialized successfully' });
  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
