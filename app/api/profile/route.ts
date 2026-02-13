import { NextRequest, NextResponse } from 'next/server';
import { getProfile, updateProfile } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET - Get profile info
export async function GET() {
    try {
        const profile = await getProfile();
        return NextResponse.json(profile || {
            name: "Ahmed Al Ghazaly",
            title: "Développeur Informatique",
            subtitle: "Développeur informatique...",
            status: "Disponible pour nouveaux projets",
            image_url: null
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

// POST - Update profile info
export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        await updateProfile({
            name: data.name || "Ahmed Al Ghazaly",
            title: data.title || "Développeur Informatique",
            subtitle: data.subtitle || "",
            status: data.status || "Disponible pour nouveaux projets",
            image_url: data.image_url || null
        });

        const updatedProfile = await getProfile();

        return NextResponse.json({
            success: true,
            message: 'Profil mis à jour',
            profile: updatedProfile
        });
    } catch (error) {
        console.error('Profile update error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
