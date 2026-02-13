
import { NextResponse } from 'next/server';
import { getLanguages } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const languages = await getLanguages();
        return NextResponse.json(languages);
    } catch (error) {
        console.error('Error fetching public languages:', error);
        return NextResponse.json([], { status: 500 });
    }
}
