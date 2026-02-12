import { NextResponse } from 'next/server';
import { existsSync, statSync } from 'fs';
import path from 'path';

export async function GET() {
    try {
        const cvPath = path.join(process.cwd(), 'public', 'uploads', 'cv', 'cv.pdf');

        if (!existsSync(cvPath)) {
            return NextResponse.json({ exists: false });
        }

        const stats = statSync(cvPath);

        return NextResponse.json({
            exists: true,
            filename: 'cv.pdf',
            uploadedAt: stats.mtime,
            size: stats.size
        });
    } catch (error) {
        console.error('Erreur récupération CV:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
