import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const baseUrl = "https://ashlyfraser.ca";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Ashly Fraser - Canada's #1 Deal Finder | Freebies, Coupons & Savings",
    template: "%s | Ashly Fraser",
  },
  description:
    "Save money with Canada's top deal hunter! Daily deals on Amazon, Lululemon, Costco, Dollarama & more. Free coupons, printable savings, and exclusive discount codes for Canadian shoppers.",
  keywords: [
    "Canada deals",
    "Canadian coupons",
    "Amazon Canada deals",
    "Lululemon sale Canada",
    "Costco deals",
    "Dollarama finds",
    "discount codes Canada",
    "free coupons Canada",
    "printable coupons",
    "savings guru",
    "Ashly Fraser",
    "Canadian shopping deals",
    "money saving tips Canada",
    "flash sales Canada",
    "birthday freebies Canada",
    "student discounts Canada",
    "senior discounts Canada",
  ],
  authors: [{ name: "Ashly Fraser", url: baseUrl }],
  creator: "Ashly Fraser",
  publisher: "Ashly Fraser",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: "Ashly Fraser - Canada's #1 Deal Finder",
    description:
      "Save money with Canada's top deal hunter! Daily deals on Amazon, Lululemon, Costco, Dollarama & more. Free coupons and exclusive discount codes.",
    url: baseUrl,
    siteName: "Ashly Finds Deals",
    images: [
      {
        url: "/images/profile/ashly.jpg",
        width: 1200,
        height: 630,
        alt: "Ashly Fraser",
      },
    ],
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ashly Fraser - Canada's #1 Deal Finder",
    description:
      "Save money with Canada's top deal hunter! Daily deals on Amazon, Lululemon, Costco, Dollarama & more.",
    images: ["/images/profile/ashly.jpg"],
    creator: "@savingsguru",
    site: "@savingsguru",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE",
  },
  category: "shopping",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      url: baseUrl,
      name: "Ashly Finds Deals",
      description: "Daily deals, freebies & coupons for Canadians",
      publisher: { "@id": `${baseUrl}/#person` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${baseUrl}/?s={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
      inLanguage: "en-CA",
    },
    {
      "@type": "Person",
      "@id": `${baseUrl}/#person`,
      name: "Ashly Fraser",
      url: baseUrl,
      image: {
        "@type": "ImageObject",
        url: `${baseUrl}/images/profile/ashly.jpg`,
        width: 600,
        height: 600,
      },
      sameAs: [
        "https://instagram.com/ashly__savingsguruca",
        "https://www.facebook.com/ashly.fraser.96/",
        "https://tiktok.com/@savingsguru",
        "https://www.youtube.com/channel/UCbVX-yAa2etLXvkYGx1C_Dw",
      ],
      jobTitle: "Deal Finder",
      worksFor: { "@id": `${baseUrl}/#organization` },
      description:
        "I find the deals so you don't have to. Amazon, Lululemon, Costco, Dollarama & more.",
    },
    {
      "@type": "WebPage",
      "@id": `${baseUrl}/#webpage`,
      url: baseUrl,
      name: "Ashly Finds Deals",
      isPartOf: { "@id": `${baseUrl}/#website` },
      about: { "@id": `${baseUrl}/#person` },
      description:
        "Save money with Canada's top deal hunter! Daily deals, free coupons, and exclusive discount codes for Canadian shoppers.",
      breadcrumb: { "@id": `${baseUrl}/#breadcrumb` },
      inLanguage: "en-CA",
      potentialAction: [
        {
          "@type": "ReadAction",
          target: [baseUrl],
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${baseUrl}/#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: baseUrl,
        },
      ],
    },
    {
      "@type": "ItemList",
      "@id": `${baseUrl}/#deals`,
      name: "Featured Deals",
      description: "Today's best deals and savings in Canada",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Costco Canada Membership Deal",
          url: "https://rstyle.me/+_72JT5Cj3V6yK0F-7ACrug",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Daily Amazon Deals",
          url: "https://www.savingsguru.ca/author/ashly1818",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "LuLuLemon Sale",
          url: "https://rstyle.me/+s2g_Jh19HtM68mHQ6bwktQ",
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-CA">
      <head>
        <link rel="canonical" href={baseUrl} />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/images/profile/ashly.jpg" />
        <meta name="theme-color" content="#39342c" />
        <meta name="geo.region" content="CA" />
        <meta name="geo.placename" content="Canada" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
