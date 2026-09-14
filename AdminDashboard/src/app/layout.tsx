import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import QueryProvider from "@/components/QueryProvider";
import PageLoader from "@/components/ui/PageLoader";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import RouteTitle from "@/components/ui/RouteTitle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "E-Shop Admin",
    template: "%s | E-Shop Admin",
  },
  description: "E-Shop administration dashboard",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex h-dvh antialiased`}
      >
        <ThemeProvider>
          <RouteTitle />
          <PageLoader />
          <QueryProvider>{children}</QueryProvider>
          <Toaster position="top-center" reverseOrder={false} />
        </ThemeProvider>
      </body>
    </html>
  );
}
