// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import "./globals.css";
// import { Toaster } from "sonner";
// // const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "ClubWize",
//   description: "ClubWize",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       {/* <body className={inter.className}> */}
//       <body>
//         {/* <Toaster position="top-right" richColors /> */}
//         {children}
//       </body>
//     </html>
//   );
// }

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Ensures text remains visible during font load
  variable: "--font-inter", // Allow usage via CSS variable
});

export const metadata: Metadata = {
  title: "ClubWize",
  description: "ClubWize - Club Management Platform",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning // Suppresses warnings for attributes added by browser extensions
    >
      <meta charSet="utf-8"></meta>
      <body
        className={cn(
          inter.variable, // Apply font as a CSS variable
          "min-h-screen bg-background font-sans antialiased"
        )}
        suppressHydrationWarning // Suppresses warnings for attributes added by browser extensions
      >
        <Toaster
          position="top-right"
          richColors
          closeButton // Add close button for better UX
          expand={false} // Prevent expanding animation which can cause hydration issues
        />
        {children}
      </body>
    </html>
  );
}
