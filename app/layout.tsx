import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "AL GHAZALY AHMED | Portfolio",
    description: "Développeur Informatique spécialisé dans la création d'applications web modernes",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr">
            <head>
                <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
            </head>
            <body>{children}</body>
        </html>
    );
}
