import type { Metadata } from "next";
import "./globals.css";
import CalendarAside from "@/components/calendarAside";
import NavBar from "@/components/navBar";


export const metadata: Metadata = {
  title: "Calendar-app",
  description: "Challenge for Bilog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className='h-screen flex flex-col'>
        <NavBar />
        <CalendarAside />
        {children}
      </body>
    </html>
  );
}
