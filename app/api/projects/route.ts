import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB, getNextId } from '@/lib/db';

// GET - List all projects
export async function GET() {
    try {
        const db = readDB();
        return NextResponse.json(db.projects || []);
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

// POST - Create new project
export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const db = readDB();

        const newProject = {
            id: getNextId('projects'),
            title: data.title,
            description: data.description,
            technologies: data.technologies || [],
            category: data.category || 'web',
            image_url: data.image_url || null,
            github_link: data.github_link || null
        };

        db.projects.push(newProject);
        writeDB(db);

        return NextResponse.json({
            success: true,
            message: 'Projet ajouté',
            id: newProject.id
        });
    } catch (error) {
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

        const db = readDB();
        const index = db.projects.findIndex((p: any) => p.id === data.id);

        if (index === -1) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        db.projects[index] = {
            ...db.projects[index],
            title: data.title,
            description: data.description,
            technologies: data.technologies || [],
            category: data.category || 'web',
            image_url: data.image_url || null,
            github_link: data.github_link || null
        };

        writeDB(db);

        return NextResponse.json({
            success: true,
            message: 'Projet mis à jour'
        });
    } catch (error) {
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

        const db = readDB();
        db.projects = db.projects.filter((p: any) => p.id !== id);
        writeDB(db);

        return NextResponse.json({
            success: true,
            message: 'Projet supprimé'
        });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
