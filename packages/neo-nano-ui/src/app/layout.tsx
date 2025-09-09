import type { Metadata } from "next";
import "@/lib/globals.css";

export const metadata: Metadata = {
  title: "Neo Nano",
  description: "Write a novel this November!",
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
