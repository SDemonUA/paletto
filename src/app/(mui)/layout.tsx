import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import "../globals.css";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Paletto | MUI Preview",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${robotoMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
