import { CONTACT } from '../constants';

const WHATSAPP_NUMBER = CONTACT.whatsapp.replace(/\+/g, '');

interface BookingDetails {
  stayOption?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function buildWhatsAppMessage(details: BookingDetails): string {
  const lines: string[] = ['Hello,'];

  if (details.stayOption) {
    lines.push(`I'd like to book *${details.stayOption}*.`);
  } else {
    lines.push("I'm interested in staying at Himalayan Valley Homestead.");
  }

  lines.push('');

  if (details.checkIn || details.checkOut) {
    lines.push('*Dates:*');
    if (details.checkIn) {
      lines.push(`Check-in: ${formatDate(details.checkIn)}`);
    }
    if (details.checkOut) {
      lines.push(`Check-out: ${formatDate(details.checkOut)}`);
    }
    lines.push('');
  }

  if (details.guests) {
    lines.push(`*Guests:* ${details.guests}`);
    lines.push('');
  }

  if (details.name || details.email || details.phone) {
    lines.push('*Contact Details:*');
    if (details.name) lines.push(`Name: ${details.name}`);
    if (details.phone) lines.push(`Phone: ${details.phone}`);
    if (details.email) lines.push(`Email: ${details.email}`);
    lines.push('');
  }

  if (details.message) {
    lines.push('*Additional Message:*');
    lines.push(details.message);
    lines.push('');
  }

  lines.push('Please let me know the availability and pricing. Thank you!');

  return lines.join('\n');
}

export function getWhatsAppUrl(details: BookingDetails): string {
  const message = buildWhatsAppMessage(details);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

export function openWhatsApp(details: BookingDetails): void {
  const url = getWhatsAppUrl(details);
  window.open(url, '_blank', 'noopener,noreferrer');
}
