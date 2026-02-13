
import { NextResponse } from 'next/server';
import { getInterests } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const interests = await getInterests();
        return NextResponse.json(interests);
    } catch (error) {
        console.error('Error fetching public interests:', error);
        return NextResponse.json([], { status: 500 });
    }
}
