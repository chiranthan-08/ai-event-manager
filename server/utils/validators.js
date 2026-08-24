import { body, param, query, validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
        value: err.value,
      })),
    });
  }
  next();
};

export const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase, one lowercase, one number, and one special character'),

  body('phone')
    .optional()
    .trim()
    .matches(/^[\+]?[0-9]{10,15}$/)
    .withMessage('Please provide a valid phone number'),

  body('role')
    .optional()
    .isIn(['user', 'organizer', 'admin'])
    .withMessage('Invalid role'),

  handleValidationErrors,
];

export const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 1, max: 128 })
    .withMessage('Password is required'),

  handleValidationErrors,
];

export const eventValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Event title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Event description is required')
    .isLength({ min: 10, max: 5000 })
    .withMessage('Description must be between 10 and 5000 characters'),

  body('date')
    .notEmpty()
    .withMessage('Event date is required')
    .isISO8601()
    .withMessage('Please provide a valid date')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Event date must be in the future');
      }
      return true;
    }),

  body('time')
    .trim()
    .notEmpty()
    .withMessage('Event time is required')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Please provide a valid time in HH:MM format'),

  body('venue')
    .trim()
    .notEmpty()
    .withMessage('Venue is required')
    .isLength({ min: 3, max: 300 })
    .withMessage('Venue must be between 3 and 300 characters'),

  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required')
    .isLength({ min: 5, max: 500 })
    .withMessage('Address must be between 5 and 500 characters'),

  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('City must be between 2 and 100 characters'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn([
      'conference',
      'workshop',
      'seminar',
      'concert',
      'exhibition',
      'sports',
      'networking',
      'charity',
      'festival',
      'other',
    ])
    .withMessage('Invalid event category'),

  body('totalTickets')
    .notEmpty()
    .withMessage('Total tickets is required')
    .isInt({ min: 1, max: 100000 })
    .withMessage('Total tickets must be between 1 and 100000'),

  body('ticketPrice')
    .notEmpty()
    .withMessage('Ticket price is required')
    .isFloat({ min: 0, max: 1000000 })
    .withMessage('Ticket price must be between 0 and 1000000'),

  body('currency')
    .optional()
    .isIn(['INR', 'USD', 'EUR', 'GBP'])
    .withMessage('Invalid currency'),

  body('maxTicketsPerPerson')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Max tickets per person must be between 1 and 10'),

  body('refundPolicy')
    .optional()
    .isIn(['full', 'partial', 'none'])
    .withMessage('Invalid refund policy'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((value) => {
      if (value.length > 10) {
        throw new Error('Maximum 10 tags allowed');
      }
      for (const tag of value) {
        if (typeof tag !== 'string' || tag.length > 50) {
          throw new Error('Each tag must be a string with max 50 characters');
        }
      }
      return true;
    }),

  handleValidationErrors,
];

export const registrationValidation = [
  body('eventId')
    .notEmpty()
    .withMessage('Event ID is required')
    .isMongoId()
    .withMessage('Invalid event ID'),

  body('numberOfTickets')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Number of tickets must be between 1 and 10'),

  body('attendeeInfo')
    .optional()
    .isArray()
    .withMessage('Attendee info must be an array')
    .custom((value, { req }) => {
      const numTickets = req.body.numberOfTickets || 1;
      if (value.length !== numTickets) {
        throw new Error('Attendee info length must match number of tickets');
      }
      for (const attendee of value) {
        if (!attendee.name || typeof attendee.name !== 'string') {
          throw new Error('Each attendee must have a valid name');
        }
        if (!attendee.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(attendee.email)) {
          throw new Error('Each attendee must have a valid email');
        }
      }
      return true;
    }),

  body('specialRequirements')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Special requirements must be under 1000 characters'),

  handleValidationErrors,
];

export const queryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('sort')
    .optional()
    .isIn(['date', '-date', 'title', '-title', 'createdAt', '-createdAt'])
    .withMessage('Invalid sort field'),

  handleValidationErrors,
];

export const idParamValidation = [
  param('id')
    .notEmpty()
    .withMessage('ID is required')
    .isMongoId()
    .withMessage('Invalid ID format'),

  handleValidationErrors,
];
