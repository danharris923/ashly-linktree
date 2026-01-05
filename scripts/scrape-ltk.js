/**
 * LTK Deal Scraper
 * Scrapes deals from Ashly's LTK page and saves to JSON
 * Avoids duplicates by checking existing deals
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const LTK_USERNAME = process.env.LTK_USERNAME || 'Ashly_Fraser';
const DATA_DIR = path.join(__dirname, '..', 'data');
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'ltk');
const DEALS_FILE = path.join(DATA_DIR, 'ltk-deals.json');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

/**
 * Fetch URL content
 */
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : require('http');
    protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

/**
 * Download image to local file
 */
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(IMAGES_DIR, filename);
    if (fs.existsSync(filepath)) {
      console.log(`  [SKIP] Image already exists: ${filename}`);
      return resolve(filepath);
    }

    const file = fs.createWriteStream(filepath);
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        fs.unlinkSync(filepath);
        return downloadImage(res.headers.location, filename).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`  [OK] Downloaded: ${filename}`);
        resolve(filepath);
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

/**
 * Load existing deals from JSON file
 */
function loadExistingDeals() {
  try {
    if (fs.existsSync(DEALS_FILE)) {
      const data = fs.readFileSync(DEALS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading existing deals:', err.message);
  }
  return { deals: [], lastUpdated: null };
}

/**
 * Save deals to JSON file
 */
function saveDeals(deals) {
  const data = {
    deals,
    lastUpdated: new Date().toISOString(),
    source: `https://www.shopltk.com/explore/${LTK_USERNAME}`
  };
  fs.writeFileSync(DEALS_FILE, JSON.stringify(data, null, 2));
  console.log(`\n[SAVED] ${deals.length} deals to ${DEALS_FILE}`);
}

/**
 * Generate unique ID for a deal (for duplicate detection)
 */
function generateDealId(deal) {
  // Create ID from product name + price (normalized)
  const normalized = `${deal.name}-${deal.price}`.toLowerCase().replace(/[^a-z0-9]/g, '');
  return normalized.substring(0, 50);
}

/**
 * Parse LTK page for product data
 * Note: LTK uses dynamic loading, so we try multiple approaches
 */
async function scrapeLtkDeals() {
  console.log(`\n[START] Scraping LTK deals for @${LTK_USERNAME}`);
  console.log(`[TIME] ${new Date().toISOString()}\n`);

  const existing = loadExistingDeals();
  const existingIds = new Set(existing.deals.map(d => d.id));
  console.log(`[INFO] Found ${existing.deals.length} existing deals\n`);

  // Try to fetch the LTK API directly
  const apiUrl = `https://api-gateway.rewardstyle.com/api/ltk/v2/users/${LTK_USERNAME}/ltks?limit=50`;

  let newDeals = [];

  try {
    console.log('[FETCH] Trying LTK API...');
    const response = await fetchUrl(apiUrl);
    const data = JSON.parse(response);

    if (data.ltks && Array.isArray(data.ltks)) {
      console.log(`[OK] Found ${data.ltks.length} LTK posts\n`);

      for (const ltk of data.ltks) {
        if (ltk.products && Array.isArray(ltk.products)) {
          for (const product of ltk.products) {
            const deal = {
              id: generateDealId({ name: product.productTitle || '', price: product.price || '' }),
              name: product.productTitle || 'Unknown Product',
              price: product.price || '',
              brand: product.retailerName || '',
              image: product.productImageUrl || '',
              url: product.productUrl || '',
              ltkId: ltk.id,
              scrapedAt: new Date().toISOString()
            };

            if (!existingIds.has(deal.id)) {
              newDeals.push(deal);
              existingIds.add(deal.id);
              console.log(`  [NEW] ${deal.name.substring(0, 50)}... - ${deal.price}`);
            }
          }
        }
      }
    }
  } catch (err) {
    console.log(`[WARN] API fetch failed: ${err.message}`);
    console.log('[INFO] Trying alternative method...\n');

    // Try scraping the public page
    try {
      const pageUrl = `https://www.shopltk.com/explore/${LTK_USERNAME}`;
      const html = await fetchUrl(pageUrl);

      // Look for JSON data embedded in the page
      const jsonMatch = html.match(/__NEXT_DATA__.*?({.+?})<\/script>/s);
      if (jsonMatch) {
        const pageData = JSON.parse(jsonMatch[1]);
        console.log('[OK] Found embedded page data');

        // Navigate the data structure to find products
        const props = pageData.props?.pageProps;
        if (props?.ltks) {
          for (const ltk of props.ltks) {
            if (ltk.products) {
              for (const product of ltk.products) {
                const deal = {
                  id: generateDealId({ name: product.title || '', price: product.price || '' }),
                  name: product.title || 'Unknown Product',
                  price: product.price || '',
                  brand: product.brand || '',
                  image: product.imageUrl || '',
                  url: product.url || '',
                  scrapedAt: new Date().toISOString()
                };

                if (!existingIds.has(deal.id)) {
                  newDeals.push(deal);
                  existingIds.add(deal.id);
                  console.log(`  [NEW] ${deal.name.substring(0, 50)}... - ${deal.price}`);
                }
              }
            }
          }
        }
      }
    } catch (err2) {
      console.log(`[ERROR] Page scrape failed: ${err2.message}`);
    }
  }

  // Download images for new deals
  if (newDeals.length > 0) {
    console.log(`\n[IMAGES] Downloading ${newDeals.length} new product images...`);
    for (const deal of newDeals) {
      if (deal.image) {
        try {
          const ext = deal.image.split('.').pop()?.split('?')[0] || 'jpg';
          const filename = `${deal.id}.${ext}`;
          await downloadImage(deal.image, filename);
          deal.localImage = `/images/ltk/${filename}`;
        } catch (err) {
          console.log(`  [WARN] Failed to download image for ${deal.name}: ${err.message}`);
        }
      }
    }
  }

  // Merge new deals with existing (new ones first)
  const allDeals = [...newDeals, ...existing.deals];

  // Keep only the most recent 100 deals
  const finalDeals = allDeals.slice(0, 100);

  console.log(`\n[SUMMARY]`);
  console.log(`  New deals found: ${newDeals.length}`);
  console.log(`  Total deals: ${finalDeals.length}`);

  saveDeals(finalDeals);

  return { newDeals: newDeals.length, totalDeals: finalDeals.length };
}

// Run the scraper
scrapeLtkDeals()
  .then(result => {
    console.log(`\n[DONE] Scraping complete!`);
    process.exit(0);
  })
  .catch(err => {
    console.error(`\n[FATAL] ${err.message}`);
    process.exit(1);
  });
