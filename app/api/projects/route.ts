
import { NextRequest, NextResponse } from 'next/server';
import { getProjects, addProject, updateProject, deleteProject } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET - List all projects
export async function GET() {
    try {
        const projects = await getProjects();
        return NextResponse.json(projects);
    } catch (error) {
        console.error('Projects fetch error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

// POST - Create new project
export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        await addProject(data);
        return NextResponse.json({ success: true, message: 'Projet ajouté' });
    } catch (error) {
        console.error('Project create error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

// PUT - Update project
export async function PUT(request: NextRequest) {
    try {
        const data = await request.json();
        if (!data.id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }
        await updateProject(data.id, data);
        return NextResponse.json({ success: true, message: 'Projet mis à jour' });
    } catch (error) {
        console.error('Project update error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

// DELETE - Delete project
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = parseInt(searchParams.get('id') || '0');
        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }
        await deleteProject(id);
        return NextResponse.json({ success: true, message: 'Projet supprimé' });
    } catch (error) {
        console.error('Project delete error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
