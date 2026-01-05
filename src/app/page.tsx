"use client";

import { useState } from "react";
import ltkData from '../data/ltk-deals.json';

// Type definitions
interface LtkDeal {
  id: string;
  name: string;
  price: string;
  brand: string;
  image: string;
  localImage?: string;
  url: string;
  scrapedAt: string;
}

interface LtkData {
  deals: LtkDeal[];
  lastUpdated: string;
  source: string;
}

const typedLtkData = ltkData as LtkData;

// Link types
interface LinkItem {
  title: string;
  url: string;
  thumbnail: string;
  badge?: string;
  subtitle?: string;
}

interface LinkCategory {
  title: string;
  links: LinkItem[];
}

// Social Icons as SVG components
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

// All link data with REAL URLs and LOCAL images
const linkCategories: Record<string, LinkCategory> = {
  freeDownloads: {
    title: "FREE Downloads",
    links: [
      {
        title: "Complete Guide to Couponing in Canada",
        url: "#",
        thumbnail: "/images/thumbnails/couponing-guide.png",
        badge: "FREE"
      },
      {
        title: "28 Days to Digital Marketing Mastery",
        url: "#",
        thumbnail: "/images/thumbnails/marketing-guide.png",
        badge: "FREE"
      },
    ]
  },
  featured: {
    title: "Featured",
    links: [
      {
        title: "Costco Canada - Membership Deal",
        url: "https://rstyle.me/+_72JT5Cj3V6yK0F-7ACrug",
        thumbnail: "/images/thumbnails/costco.png"
      },
      {
        title: "Daily Amazon Deals",
        url: "https://www.savingsguru.ca/author/ashly1818",
        thumbnail: "/images/thumbnails/amazon.png"
      },
      {
        title: "Secret Facebook Savings Group",
        url: "https://www.facebook.com/groups/savingsguru",
        thumbnail: "/images/thumbnails/facebook-group.png",
        subtitle: "Nearly 1 million followers!"
      },
      {
        title: "Shop My LTK",
        url: "https://www.shopltk.com/explore/Ashly_Fraser",
        thumbnail: "/images/thumbnails/ltk.png"
      },
    ]
  },
  limitedDeals: {
    title: "Limited Time Exclusive Deals",
    links: [
      {
        title: "LuLuLemon Sale",
        url: "https://rstyle.me/+s2g_Jh19HtM68mHQ6bwktQ",
        thumbnail: "/images/thumbnails/lululemon.png",
        badge: "HOT"
      },
      {
        title: "Michael Kors Sale",
        url: "https://rstyle.me/+FpDHJk_AQDMjZRgs9rISwA",
        thumbnail: "/images/thumbnails/michael-kors.png"
      },
      {
        title: "Sephora Sale",
        url: "https://rstyle.me/+yJZdVOpPddbNrwi9x_CJzA",
        thumbnail: "/images/thumbnails/sephora.png"
      },
      {
        title: "GAP Sale",
        url: "https://rstyle.me/+FNJEpvUwq6ZHdA6dKZU6Ew",
        thumbnail: "/images/thumbnails/gap.png"
      },
      {
        title: "Peoples Jewelers Sale",
        url: "https://rstyle.me/+VMtCTFrlU78a1o7PbuCHXw",
        thumbnail: "/images/thumbnails/peoples.png"
      },
      {
        title: "Stanley Sale",
        url: "https://rstyle.me/+J19t8HJlM2LK1OkvnCN6jA",
        thumbnail: "/images/thumbnails/stanley.png",
        badge: "NEW"
      },
    ]
  },
  coupons: {
    title: "Coupons & Freebies",
    links: [
      {
        title: "Printable Coupons",
        url: "https://www.savingsguru.ca/printable-coupons/",
        thumbnail: "/images/thumbnails/printable-coupons.jpg"
      },
      {
        title: "Mail Out Coupons - Savings Guru",
        url: "https://www.savingsguru.ca/companies-to-call-for-coupons/",
        thumbnail: "/images/thumbnails/mailout-coupons.png"
      },
      {
        title: "Birthday Freebies and Offers",
        url: "https://www.savingsguru.ca/birthday-freebies-and-offers",
        thumbnail: "/images/thumbnails/birthday.png"
      },
      {
        title: "Seniors Discounts",
        url: "https://www.savingsguru.ca/seniors-discounts",
        thumbnail: "/images/thumbnails/seniors.png"
      },
      {
        title: "Student Discounts at Canadian Retailers",
        url: "https://www.savingsguru.ca/student-discounts",
        thumbnail: "/images/thumbnails/student.png"
      },
    ]
  },
  apps: {
    title: "Money Saving Apps & Tips",
    links: [
      {
        title: "Free Home Depot Kids Workshop",
        url: "https://www.homedepot.ca/en/home/ideas-how-to/workshops.html",
        thumbnail: "/images/thumbnails/home-depot.png"
      },
      {
        title: "SampleSource.com - Free Samples",
        url: "https://www.samplesource.com/?site=en",
        thumbnail: "/images/thumbnails/samplesource.jpg"
      },
      {
        title: "Too Good To Go",
        url: "https://www.toogoodtogo.com/en-ca/user",
        thumbnail: "/images/thumbnails/toogoodtogo.png"
      },
      {
        title: "Flashfood",
        url: "https://flashfood.onelink.me/yAxk/referral",
        thumbnail: "/images/thumbnails/flashfood.png",
        subtitle: "Code: ASHL4M3YY"
      },
      {
        title: "Checkout 51",
        url: "https://www.checkout51.com/",
        thumbnail: "/images/thumbnails/checkout51.jpg"
      },
      {
        title: "reebee: Flyers & Shopping List",
        url: "https://www.appconner.com/app-reebee-flyers-shopping-list",
        thumbnail: "/images/thumbnails/reebee.png"
      },
      {
        title: "Caddle Money Savings App",
        url: "http://ssqt.co/mesd5EN",
        thumbnail: "/images/thumbnails/caddle.png"
      },
      {
        title: "Kruger Products Offer",
        url: "https://mykrugerproducts.ca/en-ca/campaigns/offer",
        thumbnail: "/images/thumbnails/kruger.jpg"
      },
      {
        title: "PC Optimum Coupons",
        url: "https://www.pcoptimum.ca/load?page=MKDigitalCoupon20230202",
        thumbnail: "/images/thumbnails/pcoptimum.png"
      },
      {
        title: "Prime Exclusive DashPass Offer",
        url: "https://www.amazon.ca/prime/offer/doordash/prime-deal",
        thumbnail: "/images/thumbnails/doordash-prime.png"
      },
      {
        title: "Skip - Online Delivery",
        url: "https://www.skipthedishes.com/r/AbvB0FhliE",
        thumbnail: "/images/thumbnails/skip.png"
      },
      {
        title: "DoorDash",
        url: "https://drd.sh/c3luC9exwHXEs19d",
        thumbnail: "/images/thumbnails/doordash.png"
      },
      {
        title: "Uber Eats",
        url: "https://ubereats.com/feed?promoCode=eats-fl8pj9j2v9",
        thumbnail: "/images/thumbnails/ubereats.png",
        subtitle: "Code: eats-fl8pj9j2v9"
      },
      {
        title: "Instacart",
        url: "https://inst.cr/t/77a2c1909",
        thumbnail: "/images/thumbnails/instacart.png",
        subtitle: "Code: A246E61"
      },
      {
        title: "Flipp: Shop Grocery Deals",
        url: "https://ca.apkpac.com/app/com.wishabi.flipp",
        thumbnail: "/images/thumbnails/flipp.png"
      },
    ]
  },
  news: {
    title: "In The News",
    links: [
      {
        title: "The Globe and Mail: The savvy shopper's guide to scoring the best deals",
        url: "https://www.theglobeandmail.com/business/adv/article-the-savvy-shoppers-guide-to-scoring-the-best-deals-this-holiday-season",
        thumbnail: "/images/thumbnails/globe-mail.jpg"
      },
    ]
  }
};

// Shop products loaded from scraped LTK data (auto-updated by GitHub Action)
const shopProducts = typedLtkData.deals.slice(0, 6).map((deal, idx) => ({
  id: idx + 1,
  name: deal.name,
  price: deal.price,
  image: deal.localImage || deal.image,
  url: deal.url,
  brand: deal.brand
}));

// Category pills for filtering
const categoryPills = ["All", "Deals", "Coupons", "Apps", "Shop", "Downloads"];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [showAllApps, setShowAllApps] = useState(false);

  // Filter logic based on active category
  const shouldShowSection = (sectionKey: string) => {
    if (activeCategory === "All") return true;
    if (activeCategory === "Deals" && (sectionKey === "featured" || sectionKey === "limitedDeals")) return true;
    if (activeCategory === "Coupons" && sectionKey === "coupons") return true;
    if (activeCategory === "Apps" && sectionKey === "apps") return true;
    if (activeCategory === "Downloads" && sectionKey === "freeDownloads") return true;
    return false;
  };

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #c4c2b4 0%, #d3d1c7 100%)" }}>
      <main className="max-w-[680px] mx-auto px-4 py-8">

        {/* Profile Section */}
        <div className="flex flex-col items-center mb-6">
          {/* Profile Picture */}
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-white shadow-lg">
            <img
              src="/images/profile/ashly.jpg"
              alt="Ashly - Savings Guru"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Name & Bio */}
          <h1 className="text-xl font-semibold text-[#39342c] mb-1">
            Ashly→Finds Deals
          </h1>
          <p className="text-sm text-[#5a534a] text-center max-w-xs mb-4">
            Amazon, Lululemon, Costco, Dollarama & more—best finds & deals daily!
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mb-6">
            <a href="https://instagram.com/ashly__savingsguruca" target="_blank" rel="noopener noreferrer"
               className="social-icon text-[#39342c] hover:text-[#5a534a]">
              <InstagramIcon />
            </a>
            <a href="https://www.facebook.com/ashly.fraser.96/" target="_blank" rel="noopener noreferrer"
               className="social-icon text-[#39342c] hover:text-[#5a534a]">
              <FacebookIcon />
            </a>
            <a href="https://tiktok.com/@savingsguru" target="_blank" rel="noopener noreferrer"
               className="social-icon text-[#39342c] hover:text-[#5a534a]">
              <TikTokIcon />
            </a>
            <a href="https://www.youtube.com/channel/UCbVX-yAa2etLXvkYGx1C_Dw" target="_blank" rel="noopener noreferrer"
               className="social-icon text-[#39342c] hover:text-[#5a534a]">
              <YouTubeIcon />
            </a>
          </div>
        </div>

        {/* Category Pill Switcher */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {categoryPills.map((pill) => (
            <button
              key={pill}
              onClick={() => setActiveCategory(pill)}
              className={`pill-button px-4 py-2 rounded-full text-sm font-medium transition-all
                ${activeCategory === pill
                  ? "bg-[#39342c] text-white"
                  : "bg-[#e8e6dc] text-[#39342c] hover:bg-[#dedad0]"
                }`}
            >
              {pill}
            </button>
          ))}
        </div>

        {/* Shop Section (when Shop is selected or All) */}
        {(activeCategory === "All" || activeCategory === "Shop") && (
          <div className="mb-8">
            <h2 className="section-header text-sm font-semibold text-[#5a534a] mb-4 text-center uppercase tracking-wide">
              Shop My Picks
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {shopProducts.map((product) => (
                <a
                  key={product.id}
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shop-card bg-white rounded-xl overflow-hidden shadow-md"
                >
                  <div className="aspect-square bg-[#f5f5f5] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-[#5a534a] line-clamp-2 mb-1">{product.name}</p>
                    <span className="text-sm font-semibold text-[#39342c]">{product.price}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Link Sections */}
        {Object.entries(linkCategories).map(([key, category]) => {
          if (!shouldShowSection(key)) return null;

          const displayLinks = key === "apps" && !showAllApps
            ? category.links.slice(0, 5)
            : category.links;

          return (
            <div key={key} className="mb-6">
              <h2 className="section-header text-sm font-semibold text-[#5a534a] mb-3 text-center uppercase tracking-wide">
                {category.title}
              </h2>
              <div className="flex flex-col gap-3">
                {displayLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-button relative flex items-center bg-[#e8e6dc] rounded-full px-4 py-3 shadow-sm"
                  >
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-full bg-[#d3d1c7] flex items-center justify-center overflow-hidden mr-3 flex-shrink-0">
                      <img
                        src={link.thumbnail}
                        alt={link.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Link text */}
                    <div className="flex-grow pr-2">
                      <span className="text-sm font-medium text-[#39342c] block">
                        {link.title}
                      </span>
                      {"subtitle" in link && link.subtitle && (
                        <span className="text-xs text-[#5a534a]">{link.subtitle}</span>
                      )}
                    </div>

                    {/* Badge if exists */}
                    {"badge" in link && link.badge && (
                      <span className={`absolute right-4 px-2 py-0.5 text-white text-xs font-bold rounded-full ${
                        link.badge === "FREE" ? "bg-green-500" :
                        link.badge === "HOT" ? "bg-red-500" :
                        "bg-blue-500"
                      }`}>
                        {link.badge}
                      </span>
                    )}
                  </a>
                ))}

                {/* Show more button for apps */}
                {key === "apps" && category.links.length > 5 && (
                  <button
                    onClick={() => setShowAllApps(!showAllApps)}
                    className="text-sm text-[#5a534a] hover:text-[#39342c] font-medium py-2"
                  >
                    {showAllApps ? "Show Less ↑" : `Show ${category.links.length - 5} More ↓`}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-[#c4c2b4] text-center">
          <p className="text-xs text-[#9a9590]">
            © 2024 Ashly Finds Deals • Built with ❤️ in Canada
          </p>
          <p className="text-xs text-[#9a9590] mt-1">
            Affiliate links help support this page at no extra cost to you
          </p>
        </footer>

      </main>
    </div>
  );
}
