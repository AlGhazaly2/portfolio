
import { NextRequest, NextResponse } from 'next/server';
import { getMessages, addMessage, deleteMessage, updateMessage } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const messages = await getMessages();
        return NextResponse.json(messages);
    } catch (error) {
        console.error('Messages fetch error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        // Here we could also send email via Resend/EmailJS logic if backend-side, 
        // but frontend handles EmailJS. We just store it.
        await addMessage(data);
        return NextResponse.json({ success: true, message: 'Message enregistré' });
    } catch (error) {
        console.error('Message add error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const data = await request.json();
        if (!data.id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await updateMessage(data.id, data.is_read ?? true);
        return NextResponse.json({ success: true, message: 'Message mis à jour' });
    } catch (error) {
        console.error('Message update error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = parseInt(searchParams.get('id') || '0');
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await deleteMessage(id);
        return NextResponse.json({ success: true, message: 'Message supprimé' });
    } catch (error) {
        console.error('Message delete error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
