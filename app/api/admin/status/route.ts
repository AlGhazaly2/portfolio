
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await sql`SELECT 1`;
        return NextResponse.json({
            connected: true,
            message: "Database Connected"
        });
    } catch (error) {
        console.error('DB Status Check Error:', error);
        return NextResponse.json({
            connected: false,
            message: "Database Not Connected (Check Vercel Storage Tab)",
            error: String(error)
        }, { status: 500 });
    }
}
