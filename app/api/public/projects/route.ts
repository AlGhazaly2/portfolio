
import { NextResponse } from 'next/server';
import { getProjects } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Public API for fetching projects (no auth required)
export async function GET() {
    try {
        const projects = await getProjects();

        // Transform database format to match frontend types if needed
        // Note: Check if the fields match what the frontend expects.
        // Frontend likely expects: title, description, technologies [], category, image, link
        // DB has: title, description, technologies, category, image_url, github_link

        const formattedProjects = projects.map((project: any) => ({
            id: project.id,
            title: project.title,
            description: project.description,
            technologies: project.technologies || [],
            category: project.category || 'web',
            image: project.image_url || '',
            link: project.github_link || undefined
        }));

        return NextResponse.json(formattedProjects);
    } catch (error) {
        console.error('Error fetching public projects:', error);
        return NextResponse.json([], { status: 500 });
    }
}
