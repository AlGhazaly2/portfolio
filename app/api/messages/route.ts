import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB, getNextId } from '@/lib/db';

export async function GET() {
    try {
        const db = readDB();
        return NextResponse.json(db.messages || []);
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const db = readDB();

        const newMessage = {
            id: getNextId('messages'),
            name: data.name,
            email: data.email,
            message: data.message,
            is_read: false,
            created_at: new Date().toISOString()
        };

        db.messages.push(newMessage);
        writeDB(db);

        return NextResponse.json({
            success: true,
            message: 'Message enregistré',
            id: newMessage.id
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
        const index = db.messages.findIndex((m: any) => m.id === data.id);

        if (index === -1) {
            return NextResponse.json({ error: 'Message not found' }, { status: 404 });
        }

        db.messages[index].is_read = data.is_read ?? true;
        writeDB(db);

        return NextResponse.json({
            success: true,
            message: 'Message mis à jour'
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
        db.messages = db.messages.filter((m: any) => m.id !== id);
        writeDB(db);

        return NextResponse.json({
            success: true,
            message: 'Message supprimé'
        });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
