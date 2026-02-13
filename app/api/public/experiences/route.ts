
import { NextResponse } from 'next/server';
import { getExperiences } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const experiences = await getExperiences();
        return NextResponse.json(experiences);
    } catch (error) {
        console.error('Error fetching public experiences:', error);
        return NextResponse.json([], { status: 500 });
    }
}
