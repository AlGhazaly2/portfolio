
import { NextResponse } from 'next/server';
import { getSkills } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const skills = await getSkills();
        return NextResponse.json(skills);
    } catch (error) {
        console.error('Error fetching public skills:', error);
        return NextResponse.json([], { status: 500 });
    }
}
