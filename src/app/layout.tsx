import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppBar from "@/components/AppBar";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Crypto Tax Made Easy",
  description: "Taxes are no issue with Crypto Tax Made Easy ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppBar />
        <div className="relative">
          <Image
            src={"/images/backgrounds/background.png"}
            alt={"background"}
            className="absolute -z-10"
            fill
            style={{
              objectFit: "cover",
            }}
            priority
          />
          {children}
        </div>
      </body>
    </html>
  );
}
