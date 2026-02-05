import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HR Management System",
  description: "A simple HRMS application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
