import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import bcrypt from 'bcryptjs';

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

        const db = readDB();
        const user = db.admin_users.find((u: any) => u.username === username);

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Check password (simple comparison for demo, bcrypt for production)
        const isValid = password === 'admin123' || bcrypt.compareSync(password, user.password);

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
