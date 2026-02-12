import { NextResponse } from 'next/server';
import { readDB, writeDB, getNextId } from '@/lib/db';

// GET - Fetch all skills
export async function GET() {
    try {
        const db = readDB();
        return NextResponse.json(db.skills || []);
    } catch (error) {
        console.error('Error fetching skills:', error);
        return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
    }
}

// POST - Create new skill
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const db = readDB();

        const newSkill = {
            id: getNextId(db.skills || []),
            name: body.name,
            level: body.level || 50,
            category: body.category || 'other'
        };

        db.skills = [...(db.skills || []), newSkill];
        writeDB(db);

        return NextResponse.json({ success: true, skill: newSkill });
    } catch (error) {
        console.error('Error creating skill:', error);
        return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 });
    }
}

// PUT - Update skill
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const db = readDB();

        const skillIndex = (db.skills || []).findIndex((s: any) => s.id === body.id);
        if (skillIndex === -1) {
            return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
        }

        db.skills[skillIndex] = {
            ...db.skills[skillIndex],
            name: body.name,
            level: body.level,
            category: body.category
        };

        writeDB(db);
        return NextResponse.json({ success: true, skill: db.skills[skillIndex] });
    } catch (error) {
        console.error('Error updating skill:', error);
        return NextResponse.json({ error: 'Failed to update skill' }, { status: 500 });
    }
}

// DELETE - Delete skill
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = parseInt(searchParams.get('id') || '0');

        const db = readDB();
        db.skills = (db.skills || []).filter((s: any) => s.id !== id);
        writeDB(db);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting skill:', error);
        return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 });
    }
}
