import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ClubWize",
  description: "ClubWize",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <body className={inter.className}> */}
      <body>
        <Toaster position="top-right" richColors />
        {children}
      </body>
    </html>
  );
}
