import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sudoku-Mobbin',
  description: 'This is a Web based sudoku game created by John Lois Frades',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-900 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
