import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB, getNextId } from '@/lib/db';

export async function GET() {
    try {
        const db = readDB();
        return NextResponse.json(db.experiences || []);
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const db = readDB();

        const newExperience = {
            id: getNextId('experiences'),
            company: data.company,
            role: data.role,
            period: data.period,
            description: data.description || [],
            display_order: data.display_order || 0
        };

        db.experiences.push(newExperience);
        writeDB(db);

        return NextResponse.json({
            success: true,
            message: 'Expérience ajoutée',
            id: newExperience.id
        });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const data = await request.json();

        if (!data.id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }

        const db = readDB();
        const index = db.experiences.findIndex((e: any) => e.id === data.id);

        if (index === -1) {
            return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
        }

        db.experiences[index] = {
            ...db.experiences[index],
            company: data.company,
            role: data.role,
            period: data.period,
            description: data.description || [],
            display_order: data.display_order || 0
        };

        writeDB(db);

        return NextResponse.json({
            success: true,
            message: 'Expérience mise à jour'
        });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = parseInt(searchParams.get('id') || '0');

        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }

        const db = readDB();
        db.experiences = db.experiences.filter((e: any) => e.id !== id);
        writeDB(db);

        return NextResponse.json({
            success: true,
            message: 'Expérience supprimée'
        });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
