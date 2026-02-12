import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function GET() {
    try {
        const cvPath = path.join(process.cwd(), 'public', 'uploads', 'cv', 'cv.pdf');

        if (!existsSync(cvPath)) {
            return NextResponse.json({ error: 'CV non disponible' }, { status: 404 });
        }

        const fileBuffer = await readFile(cvPath);

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="CV_Ahmed_Al_Ghazaly.pdf"',
            },
        });
    } catch (error) {
        console.error('Erreur téléchargement CV:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
