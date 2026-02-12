import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function DELETE(request: NextRequest) {
    try {
        // Check authentication
        const authHeader = request.headers.get('authorization');
        if (authHeader !== 'Bearer admin-secret-token') {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const cvPath = path.join(process.cwd(), 'public', 'uploads', 'cv', 'cv.pdf');

        if (!existsSync(cvPath)) {
            return NextResponse.json({ error: 'CV non trouvé' }, { status: 404 });
        }

        await unlink(cvPath);

        return NextResponse.json({
            success: true,
            message: 'CV supprimé avec succès'
        });
    } catch (error) {
        console.error('Erreur suppression CV:', error);
        return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
    }
}
