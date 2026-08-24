import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const categories = ['All', 'Weddings', 'Corporate', 'Birthday', 'Concerts', 'Conference'];

export default function ImageGallery({ images = [], loading = false }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });

  const filteredImages =
    activeCategory === 'All'
      ? images
      : images.filter((img) => img.category === activeCategory);

  const openLightbox = (index) => setLightbox({ open: true, index });
  const closeLightbox = () => setLightbox({ open: false, index: 0 });

  const goNext = () => {
    setLightbox((prev) => ({
      ...prev,
      index: (prev.index + 1) % filteredImages.length,
    }));
  };

  const goPrev = () => {
    setLightbox((prev) => ({
      ...prev,
      index: (prev.index - 1 + filteredImages.length) % filteredImages.length,
    }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-9 w-24 bg-gray-200 rounded-full animate-pulse flex-shrink-0" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-[4/3] bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-violet-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredImages.map((img, index) => (
          <div
            key={img.id || index}
            onClick={() => openLightbox(index)}
            className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer bg-gray-100"
          >
            <img
              src={img.url || img.src || '/placeholder-image.jpg'}
              alt={img.alt || `Gallery image ${index + 1}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
              <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm">
                View
              </span>
            </div>
            {img.category && (
              <span className="absolute bottom-2 left-2 px-2 py-1 text-xs font-medium bg-white/90 text-gray-700 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                {img.category}
              </span>
            )}
          </div>
        ))}
      </div>

      {filteredImages.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No images found for this category.</p>
        </div>
      )}

      {lightbox.open && filteredImages.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={goPrev}
            className="absolute left-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <img
            src={filteredImages[lightbox.index]?.url || filteredImages[lightbox.index]?.src}
            alt={filteredImages[lightbox.index]?.alt || 'Gallery image'}
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
          />

          <button
            onClick={goNext}
            className="absolute right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm font-medium bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm">
            {lightbox.index + 1} / {filteredImages.length}
          </div>
        </div>
      )}
    </div>
  );
}
