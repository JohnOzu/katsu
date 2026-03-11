import type { Metadata } from "next";
import { Fira_Sans } from "next/font/google";
import './globals.css'
import UserProvider from "../components/providers/UserProvider";
import { Toaster } from 'sonner'
import { ThemeProvider } from 'next-themes';

export const metadata: Metadata = {
  title: "Katsu",
  description: "A Class Tasks Management Application",
};

const firaSans = Fira_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  variable: "--font-fira-sans",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${firaSans.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Toaster richColors position="bottom-right" />
          <UserProvider>
            {children}
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
