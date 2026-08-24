import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Users, Star, CheckCircle, Calendar, Phone, Mail, IndianRupee, Sparkles, Heart } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const allDecorations = [
  {
    id: 1, title: 'Wedding Floral Arch', category: 'Wedding', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
    description: 'Beautiful floral arch decoration for wedding ceremonies with fresh roses and marigolds',
    price: '₹25,000 - ₹50,000', duration: '1 Day', capacity: '200-500 guests',
    venue: 'Indoor / Outdoor', rating: 4.8, reviews: 124,
    includes: ['Fresh Rose Garland', 'Marigold Strings', 'Backdrop Draping', 'Mandap Setup', 'Table Centerpieces', 'Entrance Decoration'],
    designs: ['Classic Rose Arch', 'Marigold Gateway', 'Mixed Floral Mandap', 'Garden Theme Setup'],
    contact: { phone: '+91 98765 43210', email: 'weddings@aievent.com' },
  },
  {
    id: 2, title: 'Birthday Balloon Setup', category: 'Birthday', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=400&fit=crop',
    description: 'Colorful balloon decoration for birthday parties with themed colors',
    price: '₹8,000 - ₹20,000', duration: '1 Day', capacity: '50-150 guests',
    venue: 'Indoor / Outdoor', rating: 4.6, reviews: 89,
    includes: ['Balloon Arch', 'Number Balloons', 'Themed Backdrop', 'Ceiling Balloons', 'Photo Booth Setup', 'Banner & Streamers'],
    designs: ['Rainbow Theme', 'Princess Castle', 'Super Hero Theme', 'Neon Glow Setup'],
    contact: { phone: '+91 98765 43211', email: 'birthdays@aievent.com' },
  },
  {
    id: 3, title: 'Corporate Stage Design', category: 'Corporate', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop',
    description: 'Professional stage setup for corporate events with LED screens',
    price: '₹1,50,000 - ₹5,00,000', duration: '1-3 Days', capacity: '500-5000 guests',
    venue: 'Indoor Convention Center', rating: 4.9, reviews: 201,
    includes: ['LED Wall Display', 'Professional Sound System', 'Stage Lighting', 'Podium Setup', 'Branded Banners', 'VIP Seating Area'],
    designs: ['Modern Minimalist', 'Tech Summit Stage', 'Award Night Gala', 'Product Launch Setup'],
    contact: { phone: '+91 98765 43212', email: 'corporate@aievent.com' },
  },
  {
    id: 4, title: 'Diwali Rangoli Display', category: 'Festival', image: 'https://images.unsplash.com/photo-1567880564951-5ea4251fd4be?w=600&h=400&fit=crop',
    description: 'Traditional rangoli decoration for Diwali celebrations with diyas',
    price: '₹15,000 - ₹35,000', duration: '1 Day', capacity: '100-300 guests',
    venue: 'Indoor / Outdoor', rating: 4.7, reviews: 156,
    includes: ['Rangoli Artwork', 'Brass Diyas', 'Flower Petals', 'LED String Lights', 'Toran Decoration', 'Floor Patterns'],
    designs: ['Traditional Peacock Rangoli', 'Lotus Mandala', 'Geometric Pattern', 'Flower Petal Design'],
    contact: { phone: '+91 98765 43213', email: 'festivals@aievent.com' },
  },
  {
    id: 5, title: 'Wedding Mandap Decor', category: 'Wedding', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=400&fit=crop',
    description: 'Traditional Indian wedding mandap decoration with flowers and lights',
    price: '₹40,000 - ₹1,20,000', duration: '1-2 Days', capacity: '300-1000 guests',
    venue: 'Outdoor / Banquet Hall', rating: 4.9, reviews: 178,
    includes: ['4-Pillar Mandap', 'Floral Canopy', 'Hanging Orchids', 'Draped Fabric', 'Lighting Setup', 'Aisle Decoration'],
    designs: ['South Indian Temple Style', 'North Indian Royal', 'Garden Paradise Theme', 'Crystal & Gold Theme'],
    contact: { phone: '+91 98765 43214', email: 'mandap@aievent.com' },
  },
  {
    id: 6, title: 'DJ Night Lighting', category: 'Party', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=400&fit=crop',
    description: 'Neon and laser lighting setup for DJ nights and parties',
    price: '₹30,000 - ₹80,000', duration: '1 Night', capacity: '200-1000 guests',
    venue: 'Indoor Club / Outdoor', rating: 4.5, reviews: 93,
    includes: ['Laser Light Show', 'LED Dance Floor', 'Fog Machine', 'Disco Ball', 'Strobe Lights', 'Sound System'],
    designs: ['Neon Glow Party', 'Retro Disco Night', 'EDM Festival Setup', 'Black Light Theme'],
    contact: { phone: '+91 98765 43215', email: 'parties@aievent.com' },
  },
  {
    id: 7, title: 'Anniversary Rose Petals', category: 'Anniversary', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=400&fit=crop',
    description: 'Romantic rose petal decoration for anniversary celebrations',
    price: '₹12,000 - ₹30,000', duration: '1 Day', capacity: '50-100 guests',
    venue: 'Indoor / Outdoor / Rooftop', rating: 4.8, reviews: 67,
    includes: ['Rose Petal Bed', 'Candle Arrangement', 'Photo Frame Display', 'Heart-Shaped Setup', 'Dinner Table Decor', 'Bouquet'],
    designs: ['Romantic Red Roses', 'Garden of Love', 'Silver Jubilee Theme', 'Royal Celebration'],
    contact: { phone: '+91 98765 43216', email: 'anniversary@aievent.com' },
  },
  {
    id: 8, title: 'College Fest Stage', category: 'College', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop',
    description: 'Vibrant stage decoration for college festivals with banners',
    price: '₹50,000 - ₹1,50,000', duration: '1-3 Days', capacity: '1000-5000 guests',
    venue: 'Outdoor Ground / Auditorium', rating: 4.4, reviews: 112,
    includes: ['Main Stage Setup', 'Backdrop Banners', 'Sound & Lighting', 'DJ Console', 'Crowd Control Barriers', 'VIP Enclosure'],
    designs: ['Rock Concert Stage', 'Cultural Festival', 'Fashion Show Ramp', 'Farewell Celebration'],
    contact: { phone: '+91 98765 43217', email: 'college@aievent.com' },
  },
  {
    id: 9, title: 'Royal Wedding Setup', category: 'Wedding', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop',
    description: 'Grand royal themed wedding decoration with chandeliers',
    price: '₹2,00,000 - ₹5,00,000', duration: '2-3 Days', capacity: '500-2000 guests',
    venue: 'Palace / Heritage Venue', rating: 5.0, reviews: 45,
    includes: ['Crystal Chandeliers', 'Red Carpet Entry', 'Royal Throne Setup', 'Gold Fabric Draping', 'Fountain Decor', 'Horse Carriage Entry'],
    designs: ['Mughal Grandeur', 'Rajasthani Palace', 'Victorian Elegance', 'Royal Garden Party'],
    contact: { phone: '+91 98765 43218', email: 'royal@aievent.com' },
  },
  {
    id: 10, title: 'Holi Celebration', category: 'Festival', image: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=600&h=400&fit=crop',
    description: 'Colorful Holi festival decoration with organic colors',
    price: '₹20,000 - ₹60,000', duration: '1 Day', capacity: '200-1000 guests',
    venue: 'Outdoor Ground', rating: 4.6, reviews: 134,
    includes: ['Organic Color Station', 'Water Gun Zone', 'Music System', 'DJ Booth', 'Photo Booth', 'Food Counter Setup'],
    designs: ['Traditional Holi', 'Neon Holi Party', 'Pool Party Holi', 'Royal Holi Celebration'],
    contact: { phone: '+91 98765 43219', email: 'holi@aievent.com' },
  },
  {
    id: 11, title: 'Kids Party Theme', category: 'Birthday', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=400&fit=crop',
    description: 'Fun themed decoration for kids birthday parties',
    price: '₹10,000 - ₹25,000', duration: '1 Day', capacity: '30-80 guests',
    venue: 'Indoor / Garden', rating: 4.7, reviews: 108,
    includes: ['Character Cutouts', 'Balloon Cluster', 'Game Stations', 'Piñata', 'Party Favors', 'Cake Table Setup'],
    designs: ['Superhero Theme', 'Princess Castle', 'Jungle Safari', 'Space Explorer'],
    contact: { phone: '+91 98765 43220', email: 'kids@aievent.com' },
  },
  {
    id: 12, title: 'Corporate Dinner', category: 'Corporate', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop',
    description: 'Elegant dinner setup for corporate events',
    price: '₹75,000 - ₹2,00,000', duration: '1 Evening', capacity: '100-500 guests',
    venue: 'Banquet Hall / Restaurant', rating: 4.8, reviews: 87,
    includes: ['Round Table Setup', 'Candelabra Centerpieces', 'Linen & Draping', 'Stage for Speeches', 'Welcome Arch', 'Photo Wall'],
    designs: ['Black Tie Elegance', 'Garden Dinner', 'Rooftop Soirée', 'Themed Gala Night'],
    contact: { phone: '+91 98765 43221', email: 'dinner@aievent.com' },
  },
];

export default function DecorationDetail() {
  const { id } = useParams();
  const decoration = allDecorations.find((d) => d.id === parseInt(id));
  const [activeDesign, setActiveDesign] = useState(0);

  if (!decoration) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-green-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32">
          <span className="text-6xl mb-4">🪔</span>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Decoration Not Found</h2>
          <p className="text-gray-500 mb-6">The decoration you're looking for doesn't exist.</p>
          <Link to="/decorations" className="bg-gradient-to-r from-saffron-500 to-amber-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
            Back to Gallery
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-green-50">
      <Navbar />

      {/* Hero Image */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img src={decoration.image} alt={decoration.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute top-6 left-6">
          <Link to="/decorations" className="flex items-center gap-2 bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-xl font-medium hover:bg-white transition-all shadow-lg">
            <ArrowLeft className="w-4 h-4" /> Back to Gallery
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto">
            <span className="text-xs bg-saffron-500 px-3 py-1 rounded-full font-medium">{decoration.category}</span>
            <h1 className="text-4xl md:text-5xl font-bold mt-3" style={{ fontFamily: "'Playfair Display', serif" }}>{decoration.title}</h1>
            <div className="flex items-center gap-4 mt-3 text-sm opacity-90">
              <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400" /> {decoration.rating} ({decoration.reviews} reviews)</span>
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {decoration.venue}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {decoration.duration}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>About This Decoration</h2>
              <p className="text-gray-600 leading-relaxed text-lg">{decoration.description}</p>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-saffron-50 rounded-xl p-4 text-center">
                  <IndianRupee className="w-6 h-6 text-saffron-500 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">Price Range</p>
                  <p className="font-bold text-saffron-600">{decoration.price}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <Clock className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="font-bold text-green-600">{decoration.duration}</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <Users className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">Capacity</p>
                  <p className="font-bold text-purple-600">{decoration.capacity}</p>
                </div>
              </div>
            </div>

            {/* What's Included */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>What's Included</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {decoration.includes.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Venue Designs */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Venue Design Options</h2>
              <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
                {decoration.designs.map((design, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveDesign(i)}
                    className={`px-5 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                      activeDesign === i
                        ? 'bg-gradient-to-r from-saffron-500 to-amber-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-amber-50 hover:text-saffron-600'
                    }`}
                  >
                    {design}
                  </button>
                ))}
              </div>
              <div className="bg-gradient-to-br from-saffron-50 to-amber-50 rounded-2xl p-8 text-center">
                <Sparkles className="w-12 h-12 text-saffron-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">{decoration.designs[activeDesign]}</h3>
                <p className="text-gray-600">Our expert team will customize this design to match your vision and venue perfectly.</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-500 mb-1">Starting from</p>
                <p className="text-3xl font-bold text-saffron-600" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {decoration.price.split(' - ')[0]}
                </p>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-saffron-500" /> {decoration.duration}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Users className="w-4 h-4 text-saffron-500" /> {decoration.capacity}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-saffron-500" /> {decoration.venue}
                </div>
              </div>
              <button className="w-full bg-gradient-to-r from-saffron-500 to-amber-500 text-white py-3 rounded-xl font-semibold text-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 mb-3">
                <Heart className="w-5 h-5" /> Book This Decoration
              </button>
              <button className="w-full border-2 border-saffron-500 text-saffron-600 py-3 rounded-xl font-semibold hover:bg-saffron-50 transition-all flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" /> Request Callback
              </button>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Contact Us</h3>
              <div className="space-y-3">
                <a href={`tel:${decoration.contact.phone}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-saffron-50 transition-all">
                  <Phone className="w-5 h-5 text-saffron-500" />
                  <span className="text-gray-700 font-medium">{decoration.contact.phone}</span>
                </a>
                <a href={`mailto:${decoration.contact.email}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-saffron-50 transition-all">
                  <Mail className="w-5 h-5 text-saffron-500" />
                  <span className="text-gray-700 font-medium">{decoration.contact.email}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
