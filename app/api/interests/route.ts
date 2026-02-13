
import { NextRequest, NextResponse } from 'next/server';
import { getInterests, addInterest, updateInterest, deleteInterest } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const interests = await getInterests();
        return NextResponse.json(interests);
    } catch (error) {
        console.error('Interests fetch error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        await addInterest(data);
        return NextResponse.json({ success: true, message: 'Intérêt ajouté' });
    } catch (error) {
        console.error('Interest add error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const data = await request.json();
        if (!data.id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await updateInterest(data.id, data);
        return NextResponse.json({ success: true, message: 'Intérêt mis à jour' });
    } catch (error) {
        console.error('Interest update error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = parseInt(searchParams.get('id') || '0');
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await deleteInterest(id);
        return NextResponse.json({ success: true, message: 'Intérêt supprimé' });
    } catch (error) {
        console.error('Interest delete error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
