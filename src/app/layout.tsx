import type { Metadata } from "next";
import { Anuphan } from "next/font/google";
import "./globals.css";

const anuphan = Anuphan({
  variable: "--font-anuphan",
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PLUMBERZ | ช่างประปาด่วน 24 ชั่วโมง ใกล้ฉัน | กรุงเทพ ปริมณฑล",
  description:
    "บริการช่างประปาด่วน 24 ชั่วโมง แก้ปัญหาท่อน้ำรั่ว ท่อแตก ปั๊มน้ำเสีย เข้าหน้างานไว รับประกันผลงาน ทั่วกรุงเทพและปริมณฑล โทร 064-408-8510",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${anuphan.variable} h-full antialiased`}
      style={{ fontFamily: "var(--font-anuphan), sans-serif" }}
    >
      <body
        className="min-h-full flex flex-col"
        style={{ fontFamily: "var(--font-anuphan), sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
