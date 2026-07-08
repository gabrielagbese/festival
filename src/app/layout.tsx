import { Inter } from "next/font/google";

import Header from "../components/Header";
import "./globals.css";
import "@/vendor/react-photo-album/dist/styles/rows.css";
import "@/vendor/photoswipe/dist/photoswipe.css";
import Footer from "../components/Footer";
import { ThemeProvider } from "../components/ThemeProvider";
import { Analytics } from "@vercel/analytics/react";
import MouseTrailWrapper from "../components/MouseTrailWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Annual Tech-Art Festival",
    description:
        "Experience the future at our annual tech festival and workshops",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider>
                    <MouseTrailWrapper />
                    <Header />
                    <Analytics />
                    <main className="min-h-screen bg-background text-foreground">
                        {children}
                    </main>
                    <Footer />
                </ThemeProvider>
            </body>
        </html>
    );
}
