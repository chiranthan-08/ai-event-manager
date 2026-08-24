import { useState } from 'react';
import { Sparkles, Eye, X } from 'lucide-react';

const decorations = [
  { id: 1, title: 'Wedding Floral Arch', category: 'Wedding', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop', description: 'Beautiful floral arch decoration for wedding ceremonies with fresh roses and marigolds' },
  { id: 2, title: 'Birthday Balloon Setup', category: 'Birthday', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=400&fit=crop', description: 'Colorful balloon decoration for birthday parties with themed colors' },
  { id: 3, title: 'Corporate Stage Design', category: 'Corporate', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop', description: 'Professional stage setup for corporate events with LED screens' },
  { id: 4, title: 'Diwali Rangoli Display', category: 'Festival', image: 'https://images.unsplash.com/photo-1606503153255-59d8b2e4b9e4?w=600&h=400&fit=crop', description: 'Traditional rangoli decoration for Diwali celebrations with diyas' },
  { id: 5, title: 'Wedding Mandap Decor', category: 'Wedding', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=400&fit=crop', description: 'Traditional Indian wedding mandap decoration with flowers and lights' },
  { id: 6, title: 'DJ Night Lighting', category: 'Party', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=400&fit=crop', description: 'Neon and laser lighting setup for DJ nights and parties' },
  { id: 7, title: 'Anniversary Rose Petals', category: 'Anniversary', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=400&fit=crop', description: 'Romantic rose petal decoration for anniversary celebrations' },
  { id: 8, title: 'College Fest Stage', category: 'College', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop', description: 'Vibrant stage decoration for college festivals with banners' },
  { id: 9, title: 'Royal Wedding Setup', category: 'Wedding', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop', description: 'Grand royal themed wedding decoration with chandeliers' },
  { id: 10, title: 'Holi Celebration', category: 'Festival', image: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=600&h=400&fit=crop', description: 'Colorful Holi festival decoration with organic colors' },
  { id: 11, title: 'Kids Party Theme', category: 'Birthday', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=400&fit=crop', description: 'Fun themed decoration for kids birthday parties' },
  { id: 12, title: 'Corporate Dinner', category: 'Corporate', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop', description: 'Elegant dinner setup for corporate events' },
];

const categories = ['All', 'Wedding', 'Birthday', 'Corporate', 'Festival', 'Anniversary', 'Party', 'College'];

export default function Decorations() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightbox, setLightbox] = useState(null);

  const filtered = selectedCategory === 'All'
    ? decorations
    : decorations.filter(d => d.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-green-50">
      {/* Hero */}
      <div className="relative bg-gradient-to-r from-indian-gold via-amber-500 to-saffron-500 py-20 overflow-hidden">
        <div className="absolute inset-0 mandala-bg opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <span className="text-sm font-medium tracking-widest uppercase opacity-90">Our Portfolio</span>
          <h1 className="text-5xl md:text-6xl font-bold mt-2 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Decoration Gallery
          </h1>
          <p className="text-lg opacity-90 max-w-xl mx-auto">
            Explore our stunning collection of event decorations from weddings to festivals
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none"><path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H0Z" fill="white"/></svg>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-wrap gap-3 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-xl font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-indian-gold to-amber-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-amber-50 hover:text-indian-gold'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl overflow-hidden shadow-lg card-hover cursor-pointer"
              onClick={() => setLightbox(item)}
            >
              <img src={item.image} alt={item.title} className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <span className="text-xs bg-saffron-500 px-2 py-0.5 rounded-full">{item.category}</span>
                  <h3 className="font-bold mt-2">{item.title}</h3>
                  <div className="flex items-center gap-1 mt-1 text-xs opacity-80">
                    <Eye className="w-3 h-3" /> View Details
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <div className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full card-hover" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.image} alt={lightbox.title} className="w-full h-80 object-cover" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs bg-saffron-100 text-saffron-600 px-3 py-1 rounded-full font-medium">{lightbox.category}</span>
                <button onClick={() => setLightbox(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{lightbox.title}</h3>
              <p className="text-gray-500">{lightbox.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
