import { NextResponse } from 'next/server';
import { readDB, writeDB, getNextId } from '@/lib/db';

// GET - Fetch all languages
export async function GET() {
    try {
        const db = readDB();
        return NextResponse.json(db.languages || []);
    } catch (error) {
        console.error('Error fetching languages:', error);
        return NextResponse.json({ error: 'Failed to fetch languages' }, { status: 500 });
    }
}

// POST - Create new language
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const db = readDB();

        const newLanguage = {
            id: getNextId(db.languages || []),
            name: body.name,
            level: body.level || 'Débutant'
        };

        db.languages = [...(db.languages || []), newLanguage];
        writeDB(db);

        return NextResponse.json({ success: true, language: newLanguage });
    } catch (error) {
        console.error('Error creating language:', error);
        return NextResponse.json({ error: 'Failed to create language' }, { status: 500 });
    }
}

// PUT - Update language
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const db = readDB();

        const languageIndex = (db.languages || []).findIndex((l: any) => l.id === body.id);
        if (languageIndex === -1) {
            return NextResponse.json({ error: 'Language not found' }, { status: 404 });
        }

        db.languages[languageIndex] = {
            ...db.languages[languageIndex],
            name: body.name,
            level: body.level
        };

        writeDB(db);
        return NextResponse.json({ success: true, language: db.languages[languageIndex] });
    } catch (error) {
        console.error('Error updating language:', error);
        return NextResponse.json({ error: 'Failed to update language' }, { status: 500 });
    }
}

// DELETE - Delete language
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = parseInt(searchParams.get('id') || '0');

        const db = readDB();
        db.languages = (db.languages || []).filter((l: any) => l.id !== id);
        writeDB(db);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting language:', error);
        return NextResponse.json({ error: 'Failed to delete language' }, { status: 500 });
    }
}
