import { NextResponse } from 'next/server';
import { readDB } from '@/lib/db';

// Public API for fetching interests (no auth required)
export async function GET() {
    try {
        const db = readDB();
        return NextResponse.json(db.interests || []);
    } catch (error) {
        console.error('Error fetching public interests:', error);
        return NextResponse.json([], { status: 500 });
    }
}
