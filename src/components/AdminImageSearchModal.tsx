import React, { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  Check, 
  ExternalLink, 
  Image as ImageIcon, 
  Upload, 
  Link as LinkIcon, 
  Sparkles, 
  AlertCircle,
  Eye,
  CheckCircle2,
  Database
} from 'lucide-react';
import { GoogleImageResult } from '../types';
import { useToast } from '../context/ToastContext';

interface AdminImageSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultQuery: string;
  onSelectImages: (imageUrls: string[]) => void;
}

export const AdminImageSearchModal: React.FC<AdminImageSearchModalProps> = ({
  isOpen,
  onClose,
  defaultQuery,
  onSelectImages
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'search' | 'upload' | 'url'>('search');
  const [query, setQuery] = useState(defaultQuery || '');
  const [results, setResults] = useState<GoogleImageResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<string>('');
  const [isCached, setIsCached] = useState(false);
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<GoogleImageResult | null>(null);

  // Manual URL tab
  const [manualUrl, setManualUrl] = useState('');

  // Search API credentials toggle/state
  const [showConfig, setShowConfig] = useState(false);
  const [googleApiKey, setGoogleApiKey] = useState('');
  const [googleCx, setGoogleCx] = useState('');

  useEffect(() => {
    if (isOpen && defaultQuery) {
      setQuery(defaultQuery);
      handleSearch(defaultQuery);
    }
  }, [isOpen, defaultQuery]);

  if (!isOpen) return null;

  const handleSearch = async (searchTerm?: string) => {
    const q = (searchTerm !== undefined ? searchTerm : query).trim();
    if (!q) return;

    setIsLoading(true);
    try {
      let url = `/api/images/search?q=${encodeURIComponent(q)}`;
      if (googleApiKey && googleCx) {
        url += `&apiKey=${encodeURIComponent(googleApiKey)}&cx=${encodeURIComponent(googleCx)}`;
      }

      const res = await fetch(url);
      const data = res && typeof res.json === 'function' ? await res.json() : null;

      if (res && res.ok && data && data.results) {
        setResults(data.results);
        setProvider(data.provider || 'API Provider');
        setIsCached(!!data.cached);
      } else {
        showToast(data?.error || 'Failed to search images', 'error');
      }
    } catch (err: any) {
      showToast('Network error while searching images', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelectUrl = (url: string) => {
    setSelectedUrls(prev =>
      prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]
    );
  };

  const handleConfirmSelection = () => {
    if (selectedUrls.length === 0) {
      showToast('Please select at least one image', 'info');
      return;
    }
    onSelectImages(selectedUrls);
    showToast(`Added ${selectedUrls.length} image(s) to product gallery`, 'success');
    onClose();
  };

  const handleManualUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrl.trim()) return;
    onSelectImages([manualUrl.trim()]);
    showToast('Image URL associated with product', 'success');
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const urls: string[] = [];
    let count = 0;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = event => {
        if (event.target?.result) {
          urls.push(event.target.result as string);
          count++;
          if (count === files.length) {
            onSelectImages(urls);
            showToast(`Uploaded ${urls.length} images successfully`, 'success');
            onClose();
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-2xl">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Dynamic Product Image Finder</span>
                <span className="px-2 py-0.5 text-[10px] bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-extrabold rounded-full uppercase">
                  Google Search API
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Discover, license, and import high-res product media directly into the catalog.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center justify-between gap-2 pt-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('search')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'search'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Image Search API</span>
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'upload'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Manual Upload</span>
            </button>
            <button
              onClick={() => setActiveTab('url')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'url'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Direct URL</span>
            </button>
          </div>

          {activeTab === 'search' && (
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="text-[11px] font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 underline"
            >
              {showConfig ? 'Hide API Config' : 'Custom Search API Key (Optional)'}
            </button>
          )}
        </div>

        {/* Optional Google Custom Search API Key / Engine ID Settings */}
        {showConfig && activeTab === 'search' && (
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl my-2 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Google Custom Search API Configuration</span>
            </div>
            <p className="text-[11px] text-slate-500">
              By default, Ruptha Bazzar uses an authorized licensed media engine + cached media. You can also connect your own Google Cloud Custom Search JSON API Key and Search Engine ID (cx) below:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="password"
                placeholder="Google API Key (e.g. AIzaSy...)"
                value={googleApiKey}
                onChange={e => setGoogleApiKey(e.target.value)}
                className="h-8 px-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
              />
              <input
                type="text"
                placeholder="Custom Search Engine ID (cx)"
                value={googleCx}
                onChange={e => setGoogleCx(e.target.value)}
                className="h-8 px-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
              />
            </div>
          </div>
        )}

        {/* Tab 1: Image Search */}
        {activeTab === 'search' && (
          <div className="flex-1 flex flex-col overflow-hidden pt-3">
            {/* Search Input Bar */}
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSearch();
              }}
              className="flex gap-2 mb-3"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="e.g. Nike Air Max, Sony WH-1000XM5, Minimalist Oak Desk..."
                  className="w-full h-10 pl-10 pr-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 h-10 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </form>

            {/* Provider and Cache Status */}
            {provider && (
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2 px-1">
                <span className="flex items-center gap-1">
                  Provider: <strong className="text-slate-800 dark:text-slate-200">{provider}</strong>
                </span>
                {isCached && (
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <Database className="w-3 h-3" /> Cached (Quota Optimized)
                  </span>
                )}
              </div>
            )}

            {/* Results Grid */}
            <div className="flex-1 overflow-y-auto pr-1">
              {isLoading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-slate-500 font-medium">
                    Querying authorized image search engine...
                  </span>
                </div>
              ) : results.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <ImageIcon className="w-12 h-12 mb-2 stroke-1" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    No image results found for "{query}"
                  </p>
                  <p className="text-xs text-slate-500 max-w-sm mt-1">
                    Try entering generic product names such as "Running Shoes", "Wireless Headphones", or "Desk".
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {results.map((item, idx) => {
                    const isSelected = selectedUrls.includes(item.url);
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleSelectUrl(item.url)}
                        className={`group relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-indigo-600 ring-2 ring-indigo-500/20'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
                        }`}
                      >
                        <div className="aspect-square bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <img
                            src={item.thumbnail || item.url}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Selection Checkmark */}
                        <div
                          className={`absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-indigo-600 text-white shadow-md'
                              : 'bg-black/50 text-white/70 group-hover:bg-black/70'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </div>

                        {/* Preview button */}
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            setPreviewImage(item);
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
                          title="Preview full size"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Metadata Tag */}
                        <div className="p-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                          <div className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                            {item.title}
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-0.5">
                            <span className="truncate max-w-[100px]">{item.source}</span>
                            {item.width && item.height && (
                              <span>{item.width}x{item.height}</span>
                            )}
                          </div>
                          {item.license && (
                            <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-medium truncate mt-0.5">
                              {item.license}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between mt-3">
              <span className="text-xs text-slate-500">
                {selectedUrls.length} image(s) selected
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={selectedUrls.length === 0}
                  onClick={handleConfirmSelection}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Attach to Product ({selectedUrls.length})</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Manual Upload */}
        {activeTab === 'upload' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-full max-w-md border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-8 hover:border-indigo-500 transition-colors">
              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Upload Product Images
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                Supports JPG, PNG, WebP, AVIF up to 10MB each
              </p>
              <label className="inline-block py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-md shadow-indigo-600/20">
                <span>Select Files from Computer</span>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}

        {/* Tab 3: Direct URL */}
        {activeTab === 'url' && (
          <form onSubmit={handleManualUrlSubmit} className="flex-1 flex flex-col justify-center p-8 max-w-lg mx-auto w-full space-y-4">
            <div className="text-center">
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Attach External Image URL
              </h4>
              <p className="text-xs text-slate-500">
                Paste any valid CDN or public image URL (Unsplash, Cloudinary, AWS S3, etc.)
              </p>
            </div>

            <input
              type="url"
              required
              value={manualUrl}
              onChange={e => setManualUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />

            {manualUrl && (
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border">
                <img
                  src={manualUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={() => showToast('Image preview failed to load', 'error')}
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20"
            >
              Attach Image URL
            </button>
          </form>
        )}

        {/* High-Resolution Preview Modal */}
        {previewImage && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="relative max-w-3xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl p-4">
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-4 right-4 p-2 bg-white/20 text-white hover:bg-white/40 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-h-[70vh] flex items-center justify-center overflow-hidden mb-4">
                <img
                  src={previewImage.url}
                  alt={previewImage.title}
                  className="max-h-[68vh] object-contain rounded-xl"
                />
              </div>

              <div className="flex items-center justify-between text-white text-xs">
                <div>
                  <div className="font-bold">{previewImage.title}</div>
                  <div className="text-slate-400">
                    Source: {previewImage.source} • {previewImage.license || 'Licensed Media'}
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    href={previewImage.contextLink}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center gap-1 text-slate-300"
                  >
                    <span>Attribution</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={() => {
                      toggleSelectUrl(previewImage.url);
                      setPreviewImage(null);
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold"
                  >
                    {selectedUrls.includes(previewImage.url) ? 'Deselect' : 'Select This Image'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
