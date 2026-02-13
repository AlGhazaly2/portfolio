
import { NextRequest, NextResponse } from 'next/server';
import { getLanguages, addLanguage, updateLanguage, deleteLanguage } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const languages = await getLanguages();
        return NextResponse.json(languages);
    } catch (error) {
        console.error('Languages fetch error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        await addLanguage(data);
        return NextResponse.json({ success: true, message: 'Langue ajoutée' });
    } catch (error) {
        console.error('Language add error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const data = await request.json();
        if (!data.id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await updateLanguage(data.id, data);
        return NextResponse.json({ success: true, message: 'Langue mise à jour' });
    } catch (error) {
        console.error('Language update error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = parseInt(searchParams.get('id') || '0');
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await deleteLanguage(id);
        return NextResponse.json({ success: true, message: 'Langue supprimée' });
    } catch (error) {
        console.error('Language delete error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
