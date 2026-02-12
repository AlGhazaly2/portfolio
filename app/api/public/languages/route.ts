import { NextResponse } from 'next/server';
import { readDB } from '@/lib/db';

// Public API for fetching languages (no auth required)
export async function GET() {
    try {
        const db = readDB();
        return NextResponse.json(db.languages || []);
    } catch (error) {
        console.error('Error fetching public languages:', error);
        return NextResponse.json([], { status: 500 });
    }
}
