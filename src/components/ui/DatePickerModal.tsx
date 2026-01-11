import { useState, useEffect } from 'react';
import { X, Calendar, Users, MessageCircle } from 'lucide-react';
import { openWhatsApp, formatDate } from '../../utils/whatsapp';

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  stayOption: string;
}

export function DatePickerModal({ isOpen, onClose, stayOption }: DatePickerModalProps) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (checkIn && checkOut && new Date(checkOut) <= new Date(checkIn)) {
      const nextDay = new Date(checkIn);
      nextDay.setDate(nextDay.getDate() + 1);
      setCheckOut(nextDay.toISOString().split('T')[0]);
    }
  }, [checkIn, checkOut]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    openWhatsApp({
      stayOption,
      checkIn,
      checkOut,
      guests,
    });
    onClose();
    setCheckIn('');
    setCheckOut('');
    setGuests('2');
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const minCheckOut = checkIn
    ? new Date(new Date(checkIn).getTime() + 86400000).toISOString().split('T')[0]
    : today;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-forest-600 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-serif font-semibold">Check Availability</h2>
              <p className="text-cream-200 text-sm mt-1">{stayOption}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                <Calendar className="w-4 h-4 inline-block mr-1.5 text-forest-600" />
                Check-in
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={today}
                required
                className="w-full px-3 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-forest-500 transition-colors text-sm"
              />
              {checkIn && (
                <p className="text-xs text-stone-500 mt-1">{formatDate(checkIn)}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                <Calendar className="w-4 h-4 inline-block mr-1.5 text-forest-600" />
                Check-out
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={minCheckOut}
                required
                className="w-full px-3 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-forest-500 transition-colors text-sm"
              />
              {checkOut && (
                <p className="text-xs text-stone-500 mt-1">{formatDate(checkOut)}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              <Users className="w-4 h-4 inline-block mr-1.5 text-forest-600" />
              Number of Guests
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full px-3 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-forest-500 transition-colors text-sm"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, '10+'].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Check on WhatsApp
          </button>

          <p className="text-xs text-center text-stone-500">
            You'll be redirected to WhatsApp with your booking details
          </p>
        </form>
      </div>
    </div>
  );
}
