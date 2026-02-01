import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'NightLog API is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes will be added here
// app.use('/api/auth', authRoutes);
// app.use('/api/dreams', dreamRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/analysis', analysisRoutes);
// app.use('/api/insights', insightsRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════════╗
  ║                                            ║
  ║   🌙 NightLog API Server                   ║
  ║   Running on port ${PORT}                      ║
  ║   Environment: ${process.env.NODE_ENV || 'development'}              ║
  ║                                            ║
  ╚════════════════════════════════════════════╝
  `);
});

export default app;
