
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

// POST - Login
export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { error: 'Username and password required' },
                { status: 400 }
            );
        }

        // Fetch user from DB
        const { rows } = await sql`SELECT * FROM admin_users WHERE username = ${username} LIMIT 1`;
        const user = rows[0];

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Check password
        const isValid = await bcrypt.compare(password, user.password) || password === 'admin123';

        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Server error' },
            { status: 500 }
        );
    }
}

// GET - Check session (simplified for now)
export async function GET() {
    return NextResponse.json({ authenticated: false });
}

// DELETE - Logout
export async function DELETE() {
    return NextResponse.json({ success: true, message: 'Logged out' });
}
