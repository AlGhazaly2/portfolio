
import { NextRequest, NextResponse } from 'next/server';
import { getSkills, addSkill, updateSkill, deleteSkill } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const skills = await getSkills();
        return NextResponse.json(skills);
    } catch (error) {
        console.error('Skills fetch error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        await addSkill(data);
        return NextResponse.json({ success: true, message: 'Compétence ajoutée' });
    } catch (error) {
        console.error('Skill add error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const data = await request.json();
        if (!data.id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await updateSkill(data.id, data);
        return NextResponse.json({ success: true, message: 'Compétence mise à jour' });
    } catch (error) {
        console.error('Skill update error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = parseInt(searchParams.get('id') || '0');
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await deleteSkill(id);
        return NextResponse.json({ success: true, message: 'Compétence supprimée' });
    } catch (error) {
        console.error('Skill delete error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
