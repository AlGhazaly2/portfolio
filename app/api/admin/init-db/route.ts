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

        return NextResponse.json({ success: true, message: 'Database initialized successfully' });
    } catch (error) {
        console.error('Database initialization error:', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
