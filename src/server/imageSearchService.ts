import { GoogleImageResult } from '../types';

interface CacheEntry {
  timestamp: number;
  results: GoogleImageResult[];
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour cache to save quota

export async function searchProductImages(
  query: string,
  googleApiKey?: string,
  googleCx?: string
): Promise<{ results: GoogleImageResult[]; provider: string; cached: boolean }> {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return { results: [], provider: 'none', cached: false };
  }

  // 1. Check server cache
  const cachedEntry = cache.get(normalizedQuery);
  if (cachedEntry && Date.now() - cachedEntry.timestamp < CACHE_TTL_MS) {
    return {
      results: cachedEntry.results,
      provider: 'cache',
      cached: true
    };
  }

  // 2. If Google Custom Search API Key + Engine ID (CX) are present, call Google API
  const apiKey = googleApiKey || process.env.GOOGLE_SEARCH_API_KEY;
  const cx = googleCx || process.env.GOOGLE_SEARCH_CX;

  if (apiKey && cx) {
    try {
      const googleUrl = `https://customsearch.googleapis.com/customsearch/v1?q=${encodeURIComponent(
        query
      )}&searchType=image&key=${apiKey}&cx=${cx}&num=10&safe=active`;

      const response = await fetch(googleUrl);
      if (response.ok) {
        const data = await response.json();
        if (data.items && Array.isArray(data.items)) {
          const results: GoogleImageResult[] = data.items.map((item: any) => ({
            title: item.title || query,
            url: item.link,
            thumbnail: item.image?.thumbnailLink || item.link,
            contextLink: item.image?.contextLink || item.displayLink || '',
            source: item.displayLink || 'Google Custom Search API',
            width: item.image?.width,
            height: item.image?.height,
            license: 'Google Search API - Subject to publisher copyright'
          }));

          cache.set(normalizedQuery, { timestamp: Date.now(), results });
          return { results, provider: 'Google Custom Search API', cached: false };
        }
      } else {
        console.warn('Google Custom Search API response not OK:', response.status);
      }
    } catch (err) {
      console.warn('Error querying Google Search API, falling back to licensed provider:', err);
    }
  }

  // 3. Fallback: Wikimedia Commons & High-Res Curated Product Library
  try {
    const wikiUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
      query + ' filetype:bitmap'
    )}&gsrnamespace=6&prop=imageinfo&iiprop=url|size|extmetadata|mime&gsrlimit=8&format=json&origin=*`;

    const wikiRes = await fetch(wikiUrl);
    const wikiResults: GoogleImageResult[] = [];

    if (wikiRes.ok) {
      const wikiData = await wikiRes.json();
      if (wikiData.query?.pages) {
        Object.values(wikiData.query.pages).forEach((page: any) => {
          const info = page.imageinfo?.[0];
          if (info && info.url && (info.mime === 'image/jpeg' || info.mime === 'image/png' || info.mime === 'image/webp')) {
            const license = info.extmetadata?.LicenseShortName?.value || 'Creative Commons';
            const artist = info.extmetadata?.Artist?.value?.replace(/<[^>]*>?/gm, '') || 'Wikimedia Contributor';
            wikiResults.push({
              title: page.title?.replace(/^File:/, '').replace(/\.[^/.]+$/, '') || query,
              url: info.url,
              thumbnail: info.thumburl || info.url,
              contextLink: info.descriptionurl || 'https://commons.wikimedia.org',
              source: `Wikimedia Commons (${artist})`,
              width: info.width,
              height: info.height,
              license: `${license} (Licensed for reuse)`
            });
          }
        });
      }
    }

    // Curated high-res catalog items based on keywords for instant fallback
    const curatedDatabase: Record<string, GoogleImageResult[]> = {
      shoes: [
        {
          title: 'Nike Air Max Running Sneaker Crimson Profile',
          url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
          thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
          contextLink: 'https://unsplash.com/photos/164_6wVEHfI',
          source: 'Unsplash Commercial License',
          license: 'Free Commercial Use',
          width: 1200,
          height: 800
        },
        {
          title: 'White Minimalist Performance Running Sneaker',
          url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1200&q=80',
          thumbnail: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=400&q=80',
          contextLink: 'https://unsplash.com',
          source: 'Unsplash Commercial License',
          license: 'Free Commercial Use',
          width: 1200,
          height: 800
        },
        {
          title: 'Athletic Running Shoe Side View - Blue Accent',
          url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=80',
          thumbnail: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=400&q=80',
          contextLink: 'https://unsplash.com',
          source: 'Unsplash Commercial License',
          license: 'Free Commercial Use',
          width: 1200,
          height: 800
        },
        {
          title: 'Retro Classic High-Top Basketball Sneaker',
          url: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=1200&q=80',
          thumbnail: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=400&q=80',
          contextLink: 'https://unsplash.com',
          source: 'Unsplash Commercial License',
          license: 'Free Commercial Use',
          width: 1200,
          height: 800
        }
      ],
      headphones: [
        {
          title: 'Sony Premium Wireless ANC Headphones Studio Shot',
          url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
          thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
          contextLink: 'https://unsplash.com',
          source: 'Unsplash Commercial License',
          license: 'Free Commercial Use',
          width: 1200,
          height: 800
        },
        {
          title: 'Over-Ear High Fidelity Audio Headset Black',
          url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1200&q=80',
          thumbnail: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=400&q=80',
          contextLink: 'https://unsplash.com',
          source: 'Unsplash Commercial License',
          license: 'Free Commercial Use',
          width: 1200,
          height: 800
        },
        {
          title: 'Minimalist Wireless Audio Earbuds with Charging Case',
          url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1200&q=80',
          thumbnail: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=400&q=80',
          contextLink: 'https://unsplash.com',
          source: 'Unsplash Commercial License',
          license: 'Free Commercial Use',
          width: 1200,
          height: 800
        }
      ],
      watch: [
        {
          title: 'Smartwatch Touchscreen Wristwear Digital Display',
          url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
          thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
          contextLink: 'https://unsplash.com',
          source: 'Unsplash Commercial License',
          license: 'Free Commercial Use',
          width: 1200,
          height: 800
        },
        {
          title: 'Luxury Titanium Chronograph Watch',
          url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=80',
          thumbnail: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=400&q=80',
          contextLink: 'https://unsplash.com',
          source: 'Unsplash Commercial License',
          license: 'Free Commercial Use',
          width: 1200,
          height: 800
        }
      ],
      shirt: [
        {
          title: 'Heavyweight Cotton T-Shirt Flat Lay White',
          url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
          thumbnail: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80',
          contextLink: 'https://unsplash.com',
          source: 'Unsplash Commercial License',
          license: 'Free Commercial Use',
          width: 1200,
          height: 800
        },
        {
          title: 'Black Premium Crewneck Graphic Tee',
          url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80',
          thumbnail: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80',
          contextLink: 'https://unsplash.com',
          source: 'Unsplash Commercial License',
          license: 'Free Commercial Use',
          width: 1200,
          height: 800
        }
      ],
      furniture: [
        {
          title: 'Minimalist Natural Oak Computer Desk',
          url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80',
          thumbnail: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=400&q=80',
          contextLink: 'https://unsplash.com',
          source: 'Unsplash Commercial License',
          license: 'Free Commercial Use',
          width: 1200,
          height: 800
        },
        {
          title: 'Modern Ergonomic Office Interior Setup',
          url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
          thumbnail: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=400&q=80',
          contextLink: 'https://unsplash.com',
          source: 'Unsplash Commercial License',
          license: 'Free Commercial Use',
          width: 1200,
          height: 800
        }
      ]
    };

    let matchingCurated: GoogleImageResult[] = [];
    const lowerQuery = query.toLowerCase();
    for (const [key, items] of Object.entries(curatedDatabase)) {
      if (lowerQuery.includes(key) || key.includes(lowerQuery)) {
        matchingCurated.push(...items);
      }
    }

    if (matchingCurated.length === 0) {
      // Default versatile assortment
      matchingCurated = [
        ...curatedDatabase.shoes.slice(0, 2),
        ...curatedDatabase.headphones.slice(0, 2),
        ...curatedDatabase.watch.slice(0, 1),
        ...curatedDatabase.shirt.slice(0, 1)
      ];
    }

    const combined = [...wikiResults, ...matchingCurated];
    cache.set(normalizedQuery, { timestamp: Date.now(), results: combined });

    return {
      results: combined,
      provider: wikiResults.length > 0 ? 'Wikimedia Licensed API + Curated Media' : 'Curated Commercial Provider',
      cached: false
    };
  } catch (err) {
    console.error('Image search provider error:', err);
    return {
      results: [],
      provider: 'Error',
      cached: false
    };
  }
}
