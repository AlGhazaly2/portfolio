import { NextResponse } from 'next/server';
import { readDB } from '@/lib/db';

// Public API for fetching skills (no auth required)
export async function GET() {
    try {
        const db = readDB();
        return NextResponse.json(db.skills || []);
    } catch (error) {
        console.error('Error fetching public skills:', error);
        return NextResponse.json([], { status: 500 });
    }
}
