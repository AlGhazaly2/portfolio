import { NextResponse } from 'next/server';
import { readDB, writeDB, getNextId } from '@/lib/db';

// GET - Fetch all interests
export async function GET() {
    try {
        const db = readDB();
        return NextResponse.json(db.interests || []);
    } catch (error) {
        console.error('Error fetching interests:', error);
        return NextResponse.json({ error: 'Failed to fetch interests' }, { status: 500 });
    }
}

// POST - Create new interest
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const db = readDB();

        const newInterest = {
            id: getNextId(db.interests || []),
            name: body.name
        };

        db.interests = [...(db.interests || []), newInterest];
        writeDB(db);

        return NextResponse.json({ success: true, interest: newInterest });
    } catch (error) {
        console.error('Error creating interest:', error);
        return NextResponse.json({ error: 'Failed to create interest' }, { status: 500 });
    }
}

// PUT - Update interest
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const db = readDB();

        const interestIndex = (db.interests || []).findIndex((i: any) => i.id === body.id);
        if (interestIndex === -1) {
            return NextResponse.json({ error: 'Interest not found' }, { status: 404 });
        }

        db.interests[interestIndex] = {
            ...db.interests[interestIndex],
            name: body.name
        };

        writeDB(db);
        return NextResponse.json({ success: true, interest: db.interests[interestIndex] });
    } catch (error) {
        console.error('Error updating interest:', error);
        return NextResponse.json({ error: 'Failed to update interest' }, { status: 500 });
    }
}

// DELETE - Delete interest
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = parseInt(searchParams.get('id') || '0');

        const db = readDB();
        db.interests = (db.interests || []).filter((i: any) => i.id !== id);
        writeDB(db);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting interest:', error);
        return NextResponse.json({ error: 'Failed to delete interest' }, { status: 500 });
    }
}
