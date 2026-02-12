import { NextResponse } from 'next/server';
import { readDB } from '@/lib/db';

// Public API for fetching projects (no auth required)
export async function GET() {
    try {
        const db = readDB();

        // Transform database format to match frontend types
        const projects = (db.projects || []).map((project: any) => ({
            title: project.title,
            description: project.description,
            technologies: project.technologies || [],
            category: project.category || 'web',
            image: project.image_url || '',
            link: project.github_link || undefined
        }));

        return NextResponse.json(projects);
    } catch (error) {
        console.error('Error fetching public projects:', error);
        return NextResponse.json([], { status: 500 });
    }
}
