import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ashly→Finds Deals | SavingsGuru.ca",
  description: "Amazon, Lululemon, Costco, Dollarama & more—best finds & deals daily! Canada's top deal hunter.",
  keywords: ["deals", "coupons", "savings", "Canada", "Amazon deals", "Lululemon sale", "Costco", "discount codes"],
  openGraph: {
    title: "Ashly→Finds Deals",
    description: "Amazon, Lululemon, Costco, Dollarama & more—best finds & deals daily!",
    type: "website",
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ashly→Finds Deals",
    description: "Amazon, Lululemon, Costco, Dollarama & more—best finds & deals daily!",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
