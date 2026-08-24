import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import configureCloudinary from './config/cloudinary.js';
import { formatResponse } from './utils/helpers.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    configureCloudinary();

    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'", 'https:'],
        },
      },
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }));

    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: formatResponse(false, 'Too many requests, please try again later.'),
      standardHeaders: true,
      legacyHeaders: false,
    });
    app.use('/api/', limiter);

    const authLimiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 20,
      message: formatResponse(false, 'Too many authentication attempts, please try again later.'),
      standardHeaders: true,
      legacyHeaders: false,
    });
    app.use('/api/auth/', authLimiter);

    app.use(cors({
      origin: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',')
        : ['http://localhost:3000', 'http://localhost:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
      maxAge: 86400,
    }));

    app.use(morgan('combined'));

    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    app.get('/api/health', (req, res) => {
      res.status(200).json(
        formatResponse(true, 'Server is running', {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          environment: process.env.NODE_ENV || 'development',
        })
      );
    });

    app.use('/api/auth', (await import('./routes/auth.js')).default);
    app.use('/api/events', (await import('./routes/events.js')).default);
    app.use('/api/employees', (await import('./routes/employees.js')).default);
    app.use('/api/registrations', (await import('./routes/registrations.js')).default);
    app.use('/api/payments', (await import('./routes/payments.js')).default);
    app.use('/api/dashboard', (await import('./routes/dashboard.js')).default);
    app.use('/api/ai', (await import('./routes/ai.js')).default);
    app.use('/api/decorations', (await import('./routes/decorations.js')).default);
    app.use('/api/upload', (await import('./routes/upload.js')).default);

    app.use('/api/*', (req, res) => {
      res.status(404).json(
        formatResponse(false, `Route ${req.originalUrl} not found`)
      );
    });

    app.use((err, req, res, next) => {
      console.error('Unhandled Error:', {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        path: req.originalUrl,
        method: req.method,
        ip: req.ip,
        userId: req.user?.id,
      });

      if (err.type === 'entity.parse.failed') {
        return res.status(400).json(
          formatResponse(false, 'Invalid JSON in request body')
        );
      }

      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json(
          formatResponse(false, 'File size too large. Maximum size is 5MB.')
        );
      }

      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json(
          formatResponse(false, 'Unexpected file field')
        );
      }

      if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json(
          formatResponse(false, 'Validation Error', messages)
        );
      }

      if (err.name === 'CastError' && err.kind === 'ObjectId') {
        return res.status(400).json(
          formatResponse(false, 'Invalid ID format')
        );
      }

      if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(409).json(
          formatResponse(false, `Duplicate value for ${field}. This ${field} already exists.`)
        );
      }

      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json(
          formatResponse(false, 'Invalid token')
        );
      }

      if (err.name === 'TokenExpiredError') {
        return res.status(401).json(
          formatResponse(false, 'Token has expired')
        );
      }

      const statusCode = err.statusCode || err.status || 500;
      const message = process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message;

      res.status(statusCode).json(
        formatResponse(false, message)
      );
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });

    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      process.exit(1);
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
