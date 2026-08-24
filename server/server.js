import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import db from './utils/memoryDb.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize in-memory database with sample data
await db.init();

// Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use('/api/', limiter);

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}));

app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server running', timestamp: new Date().toISOString() });
});

// Routes
const authRoutes = (await import('./routes/auth.js')).default;
const eventRoutes = (await import('./routes/events.js')).default;
const employeeRoutes = (await import('./routes/employees.js')).default;
const registrationRoutes = (await import('./routes/registrations.js')).default;
const paymentRoutes = (await import('./routes/payments.js')).default;
const dashboardRoutes = (await import('./routes/dashboard.js')).default;
const aiRoutes = (await import('./routes/ai.js')).default;
const decorationRoutes = (await import('./routes/decorations.js')).default;

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/decorations', decorationRoutes);

// 404 handler
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n🪔 AI Event Manager Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`\n📋 Default accounts:`);
  console.log(`   Admin:    admin@example.com / admin123`);
  console.log(`   Employee: priya@example.com / employee123`);
  console.log(`   Client:   client@example.com / client123\n`);
});

export default app;
