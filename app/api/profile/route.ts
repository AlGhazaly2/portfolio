import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

// GET - Get profile info
export async function GET() {
    try {
        const db = readDB();
        // Return profile info or default if not exists
        return NextResponse.json(db.profile || {
            name: "Ahmed Al Ghazaly",
            title: "Développeur Informatique",
            subtitle: "Développeur informatique spécialisé en développement web et applications mobiles avec une forte capacité d'analyse et de conception de solutions digitales fiables, performantes et évolutives.",
            status: "Disponible pour nouveaux projets",
            image_url: null
        });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

// POST - Update profile info
export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const db = readDB();

        db.profile = {
            name: data.name || "Ahmed Al Ghazaly",
            title: data.title || "Développeur Informatique",
            subtitle: data.subtitle || "",
            status: data.status || "Disponible pour nouveaux projets",
            image_url: data.image_url || null
        };

        writeDB(db);

        return NextResponse.json({
            success: true,
            message: 'Profil mis à jour',
            profile: db.profile
        });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
