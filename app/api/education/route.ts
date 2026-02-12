import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB, getNextId } from '@/lib/db';

export async function GET() {
    try {
        const db = readDB();
        return NextResponse.json(db.education || []);
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const db = readDB();

        const newEducation = {
            id: getNextId('education'),
            school: data.school,
            degree: data.degree,
            year: data.year,
            display_order: data.display_order || 0
        };

        db.education.push(newEducation);
        writeDB(db);

        return NextResponse.json({
            success: true,
            message: 'Formation ajoutée',
            id: newEducation.id
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
        const index = db.education.findIndex((e: any) => e.id === data.id);

        if (index === -1) {
            return NextResponse.json({ error: 'Education not found' }, { status: 404 });
        }

        db.education[index] = {
            ...db.education[index],
            school: data.school,
            degree: data.degree,
            year: data.year,
            display_order: data.display_order || 0
        };

        writeDB(db);

        return NextResponse.json({
            success: true,
            message: 'Formation mise à jour'
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
        db.education = db.education.filter((e: any) => e.id !== id);
        writeDB(db);

        return NextResponse.json({
            success: true,
            message: 'Formation supprimée'
        });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
