import { Product, Category, Brand } from '../types';

export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1 // deletion
          )
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

const COMMON_DICTIONARY = [
  'nike', 'sony', 'apple', 'bose', 'dyson', 'samsung',
  'shoes', 'sneakers', 'running', 'headphones', 'earbuds',
  'watch', 'smartwatch', 'titanium', 'cotton', 't-shirt',
  'hoodie', 'desk', 'oak', 'furniture', 'monitor', 'gaming',
  'wireless', 'noise cancelling', 'purifier', 'oled'
];

export function findDidYouMean(query: string): string | null {
  const clean = query.trim().toLowerCase();
  if (clean.length < 3) return null;

  const words = clean.split(/\s+/);
  let correctedWords: string[] = [];
  let foundCorrection = false;

  for (const word of words) {
    if (COMMON_DICTIONARY.includes(word)) {
      correctedWords.push(word);
      continue;
    }

    let closest = word;
    let minDistance = 99;

    for (const dictWord of COMMON_DICTIONARY) {
      const dist = levenshteinDistance(word, dictWord);
      // Allow 1 edit for words length 3-5, 2 edits for words > 5
      const maxAllowed = word.length <= 5 ? 1 : 2;
      if (dist <= maxAllowed && dist < minDistance) {
        minDistance = dist;
        closest = dictWord;
      }
    }

    if (closest !== word) {
      foundCorrection = true;
      correctedWords.push(closest);
    } else {
      correctedWords.push(word);
    }
  }

  return foundCorrection ? correctedWords.join(' ') : null;
}

export interface SearchAutocompleteResults {
  suggestedTerms: string[];
  matchedCategories: Category[];
  matchedBrands: Brand[];
  matchedProducts: Product[];
  didYouMean: string | null;
}

export function computeAutocomplete(
  query: string,
  products: Product[],
  categories: Category[],
  brands: Brand[]
): SearchAutocompleteResults {
  const q = query.trim().toLowerCase();
  if (!q) {
    return {
      suggestedTerms: ['Wireless Earbuds', 'Running Shoes', 'Mechanical Keyboard', 'Oversized Tee', 'Apple Watch'],
      matchedCategories: categories.slice(0, 4),
      matchedBrands: brands.slice(0, 4),
      matchedProducts: [],
      didYouMean: null
    };
  }

  // Find did you mean
  const didYouMean = findDidYouMean(q);
  const activeSearch = didYouMean || q;

  // Matched categories
  const matchedCategories = categories.filter(c =>
    c.name.toLowerCase().includes(q) || c.subcategories?.some(s => s.toLowerCase().includes(q))
  );

  // Matched brands
  const matchedBrands = brands.filter(b =>
    b.name.toLowerCase().includes(q)
  );

  // Matched products
  const matchedProducts = products
    .filter(p => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.searchKeywords.some(k => k.toLowerCase().includes(q)) ||
        p.sku.toLowerCase().includes(q)
      );
    })
    .slice(0, 6);

  // Suggested search terms
  const termsSet = new Set<string>();
  products.forEach(p => {
    p.tags.forEach(t => {
      if (t.toLowerCase().includes(q)) termsSet.add(t);
    });
    p.searchKeywords.forEach(k => {
      if (k.toLowerCase().includes(q)) termsSet.add(k);
    });
  });

  return {
    suggestedTerms: Array.from(termsSet).slice(0, 5),
    matchedCategories,
    matchedBrands,
    matchedProducts,
    didYouMean
  };
}
