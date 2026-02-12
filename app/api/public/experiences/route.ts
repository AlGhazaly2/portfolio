import { NextResponse } from 'next/server';
import { readDB } from '@/lib/db';

// Public API for fetching experiences (no auth required)
export async function GET() {
    try {
        const db = readDB();

        // Sort by display_order
        const experiences = (db.experiences || []).sort((a: any, b: any) =>
            (a.display_order || 0) - (b.display_order || 0)
        );

        return NextResponse.json(experiences);
    } catch (error) {
        console.error('Error fetching public experiences:', error);
        return NextResponse.json([], { status: 500 });
    }
}
