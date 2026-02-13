
import { NextResponse } from 'next/server';
import { getEducation } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const education = await getEducation();
        return NextResponse.json(education);
    } catch (error) {
        console.error('Error fetching public education:', error);
        return NextResponse.json([], { status: 500 });
    }
}
