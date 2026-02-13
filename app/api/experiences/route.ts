
import { NextRequest, NextResponse } from 'next/server';
import { getExperiences, addExperience, updateExperience, deleteExperience } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const experiences = await getExperiences();
        return NextResponse.json(experiences);
    } catch (error) {
        console.error('Experiences fetch error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        await addExperience(data);
        return NextResponse.json({ success: true, message: 'Expérience ajoutée' });
    } catch (error) {
        console.error('Experience add error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const data = await request.json();
        if (!data.id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await updateExperience(data.id, data);
        return NextResponse.json({ success: true, message: 'Expérience mise à jour' });
    } catch (error) {
        console.error('Experience update error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = parseInt(searchParams.get('id') || '0');
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await deleteExperience(id);
        return NextResponse.json({ success: true, message: 'Expérience supprimée' });
    } catch (error) {
        console.error('Experience delete error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
