import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectToDatabase } from './config/database.js';
import { env } from './config/environment.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import routes from './routes/index.js';

const app: Application = express();

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, mobile apps)
    if (!origin) return callback(null, true);
    // Allow configured client URL
    if (origin === env.clientUrl) return callback(null, true);
    // Allow any localhost port for local development
    if (/^http:\/\/localhost:\d+$/.test(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
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

// API Routes
app.use('/api', routes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
async function startServer(): Promise<void> {
  try {
    // Connect to MongoDB
    await connectToDatabase();

    app.listen(env.port, () => {
      console.log(`🌙 NightLog API Server running on port ${env.port} [${env.nodeEnv}]`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
