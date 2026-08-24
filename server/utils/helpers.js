import { v4 as uuidv4 } from 'uuid';

export const generateTicketId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomPart = uuidv4().split('-')[0].toUpperCase();
  return `EVT-${timestamp}-${randomPart}`;
};

export const calculateRefundEligibility = (eventDate, registrationDate) => {
  const now = new Date();
  const event = new Date(eventDate);
  const registered = new Date(registrationDate);
  const hoursSinceRegistration = (now - registered) / (1000 * 60 * 60);
  const hoursUntilEvent = (event - now) / (1000 * 60 * 60);

  if (hoursUntilEvent <= 0) {
    return {
      eligible: false,
      percentage: 0,
      reason: 'Event has already started or passed.',
    };
  }

  if (hoursSinceRegistration <= 48) {
    return {
      eligible: true,
      percentage: 100,
      reason: 'Full refund available within 48 hours of registration.',
    };
  }

  if (hoursUntilEvent > 72) {
    return {
      eligible: true,
      percentage: 75,
      reason: '75% refund for cancellations more than 3 days before event.',
    };
  }

  if (hoursUntilEvent > 24) {
    return {
      eligible: true,
      percentage: 50,
      reason: '50% refund for cancellations 1-3 days before event.',
    };
  }

  if (hoursUntilEvent > 6) {
    return {
      eligible: true,
      percentage: 25,
      reason: '25% refund for cancellations 6-24 hours before event.',
    };
  }

  return {
    eligible: false,
    percentage: 0,
    reason: 'No refunds available less than 6 hours before the event.',
  };
};

export const formatResponse = (success, message, data = null, meta = null) => {
  const response = { success, message };

  if (data !== null) {
    response.data = data;
  }

  if (meta !== null) {
    response.meta = meta;
  }

  return response;
};

export const paginateResults = (query, page = 1, limit = 10) => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  return {
    query: query.skip(skip).limit(limitNum),
    page: pageNum,
    limit: limitNum,
    skip,
  };
};

export const generatePaginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .trim()
    .replace(/<[^>]*>/g, '')
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
};

export const generateOTP = (length = 6) => {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
};

export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount / 100);
};

export const calculateEventStats = (registrations) => {
  if (!registrations || registrations.length === 0) {
    return {
      totalRegistrations: 0,
      totalRevenue: 0,
      averageTicketPrice: 0,
      soldOut: false,
      occupancyRate: 0,
    };
  }

  const totalRegistrations = registrations.length;
  const totalRevenue = registrations.reduce((sum, reg) => sum + (reg.paymentAmount || 0), 0);
  const averageTicketPrice = totalRevenue / totalRegistrations;

  return {
    totalRegistrations,
    totalRevenue,
    averageTicketPrice,
    soldOut: false,
    occupancyRate: 0,
  };
};
