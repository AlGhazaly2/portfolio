
import { NextRequest, NextResponse } from 'next/server';
import { getEducation, addEducation, updateEducation, deleteEducation } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const education = await getEducation();
        return NextResponse.json(education);
    } catch (error) {
        console.error('Education fetch error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        await addEducation(data);
        return NextResponse.json({ success: true, message: 'Formation ajoutée' });
    } catch (error) {
        console.error('Education add error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const data = await request.json();
        if (!data.id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await updateEducation(data.id, data);
        return NextResponse.json({ success: true, message: 'Formation mise à jour' });
    } catch (error) {
        console.error('Education update error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = parseInt(searchParams.get('id') || '0');
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await deleteEducation(id);
        return NextResponse.json({ success: true, message: 'Formation supprimée' });
    } catch (error) {
        console.error('Education delete error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
