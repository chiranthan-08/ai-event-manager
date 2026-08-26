import { useCart } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createRegistration } from '../../services/registrationService';
import toast from 'react-hot-toast';

const categoryIcons = {
  'Flowers': '🌸',
  'Food & Snacks': '🍽️',
  'Decor': '🎨',
  'Return Gifts': '🎁',
  'Lighting': '💡',
  'Furniture': '🪑',
  'Tableware': '🍴',
  'Props': '🎭',
};

export default function Cart() {
  const { items, eventItem, ticketCount, setTicketCount, removeEventFromCart, removeItem, updateQuantity, clearCart, getTotal, getItemsByCategory } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [guestCount, setGuestCount] = useState(100);
  const [booking, setBooking] = useState(false);
  const grouped = getItemsByCategory();
  const total = getTotal();

  const perPersonItems = items.filter(i => i.unit === 'per person');
  const perPersonTotal = perPersonItems.reduce((sum, i) => sum + i.price * guestCount, 0);
  const fixedItems = items.filter(i => i.unit !== 'per person');
  const fixedItemsTotal = fixedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const addOnsTotal = perPersonTotal + fixedItemsTotal;
  const eventTotal = eventItem ? eventItem.ticketPrice * ticketCount : 0;
  const grandTotal = eventTotal + addOnsTotal;

  const handleBookNow = async () => {
    if (!user) {
      toast.error('Please login to book');
      navigate('/login');
      return;
    }
    if (!eventItem) {
      toast.error('Please select an event first');
      return;
    }
    try {
      setBooking(true);
      await createRegistration({
        eventId: eventItem._id,
        numberOfSeats: ticketCount,
        addOns: items.map(i => ({
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          category: i.category,
          unit: i.unit,
        })),
      });
      toast.success('Event booked successfully!');
      clearCart();
      navigate('/client/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Booking failed';
      toast.error(message);
    } finally {
      setBooking(false);
    }
  };

  if (!eventItem && items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Browse events and add-ons to customize your event</p>
          <Link to="/events" className="bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 transition-colors">
            Browse Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
            <p className="text-gray-500">{eventItem ? '1 event' : '0 events'} · {items.length} add-on{items.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={clearCart} className="text-red-500 hover:text-red-700 text-sm font-semibold">
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {eventItem && (
              <div className="bg-white rounded-2xl shadow-sm border border-orange-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-orange-100 bg-orange-50 flex items-center justify-between">
                  <h3 className="font-bold text-orange-900">🎉 Selected Event</h3>
                  <button onClick={removeEventFromCart} className="text-red-400 hover:text-red-600 text-sm font-semibold">Remove</button>
                </div>
                <div className="px-6 py-4 flex items-center gap-4">
                  <img
                    src={eventItem.image || eventItem.images?.[0]}
                    alt={eventItem.title}
                    className="w-20 h-20 rounded-xl object-cover"
                    onError={(e) => { e.target.src = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="#f97316" rx="12"/><text x="40" y="50" font-size="24" text-anchor="middle" fill="white" font-family="sans-serif">🎉</text></svg>`)}`; }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">{eventItem.title}</h4>
                    <p className="text-sm text-gray-500">{eventItem.category} · {eventItem.venue}</p>
                    <p className="text-sm font-medium text-orange-600">₹{eventItem.ticketPrice?.toLocaleString()} / person</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <button
                        onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                      >−</button>
                      <span className="w-8 text-center font-semibold">{ticketCount}</span>
                      <button
                        onClick={() => setTicketCount(Math.min(10, ticketCount + 1))}
                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                      >+</button>
                    </div>
                    <p className="font-bold text-orange-600">₹{(eventItem.ticketPrice * ticketCount).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}

            {!eventItem && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                <div className="text-5xl mb-4">🎪</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No event selected</h3>
                <p className="text-gray-500 mb-4">Browse events and add one to your cart to get started</p>
                <Link to="/events" className="bg-orange-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-orange-700 transition-colors inline-block">
                  Browse Events
                </Link>
              </div>
            )}

            {items.length > 0 && Object.entries(grouped).map(([category, catItems]) => (
              <div key={category} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                  <h3 className="font-bold text-gray-900">{categoryIcons[category]} {category}</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {catItems.map(item => (
                    <div key={item._id} className="px-6 py-4 flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover"
                        onError={(e) => { e.target.src = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#f97316" rx="12"/><text x="32" y="42" font-size="24" text-anchor="middle" fill="white" font-family="sans-serif">${item.category.charAt(0)}</text></svg>`)}`; }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">{item.name}</h4>
                        <p className="text-sm text-gray-500">₹{item.price.toLocaleString()} / {item.unit}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                          >−</button>
                          <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                          >+</button>
                        </div>
                        <span className="font-bold text-gray-900 w-24 text-right">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </span>
                        <button
                          onClick={() => removeItem(item._id)}
                          className="text-red-400 hover:text-red-600 p-1 transition-colors"
                        >🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Booking Summary</h3>

              {eventItem && (
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Event ({ticketCount} tickets)</span>
                    <span className="font-semibold">₹{eventTotal.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {perPersonItems.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
                  <input
                    type="number"
                    value={guestCount}
                    onChange={(e) => setGuestCount(Math.max(1, Number(e.target.value)))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                    min="1"
                  />
                </div>
              )}

              <div className="space-y-3 mb-6">
                {perPersonItems.length > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Per-person add-ons ({perPersonItems.length})</span>
                    <span className="font-semibold">₹{perPersonTotal.toLocaleString()}</span>
                  </div>
                )}
                {fixedItems.length > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Fixed-price add-ons ({fixedItems.length})</span>
                    <span className="font-semibold">₹{fixedItemsTotal.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-semibold">₹{grandTotal.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">GST (18%)</span>
                  <span className="font-semibold">₹{Math.round(grandTotal * 0.18).toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-orange-600">₹{Math.round(grandTotal * 1.18).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-400 mb-4">*Final pricing may vary based on availability and customization</p>

              {eventItem && (
                <button
                  onClick={handleBookNow}
                  disabled={booking}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-orange-500/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {booking ? 'Booking...' : '🎉 Book Now'}
                </button>
              )}

              {!eventItem && (
                <Link
                  to="/events"
                  className="block w-full bg-orange-600 text-white text-center py-3 rounded-xl font-semibold hover:bg-orange-700 transition-colors"
                >
                  Browse Events
                </Link>
              )}

              {items.length > 0 && (
                <Link
                  to="/add-ons"
                  className="block w-full text-center py-3 rounded-xl font-semibold text-orange-600 border border-orange-200 hover:bg-orange-50 transition-colors mt-2"
                >
                  Add More Items
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
