import dotenv from 'dotenv';

dotenv.config();

interface EnvironmentConfig {
  nodeEnv: string;
  port: number;
  mongodbUri: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  cookieMaxAge: number;
  clientUrl: string;
  smtp: {
    host: string;
    port: number;
    user: string;
    pass: string;
  };
  cloudinary: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
  };
  aiApiKey: string;
}

function getEnvVariable(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
}

function getEnvNumber(key: string, defaultValue?: number): number {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue === undefined) {
      throw new Error(`Environment variable ${key} is not defined`);
    }
    return defaultValue;
  }
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${key} must be a number`);
  }
  return parsed;
}

export const env: EnvironmentConfig = {
  nodeEnv: getEnvVariable('NODE_ENV', 'development'),
  port: getEnvNumber('PORT', 5000),
  mongodbUri: getEnvVariable('MONGODB_URI', 'mongodb://localhost:27017/nightlog'),
  jwtSecret: getEnvVariable('JWT_SECRET', 'dev-secret-change-in-production'),
  jwtExpiresIn: getEnvVariable('JWT_EXPIRES_IN', '7d'),
  cookieMaxAge: getEnvNumber('COOKIE_MAX_AGE', 604800000), // 7 days
  clientUrl: getEnvVariable('CLIENT_URL', 'http://localhost:5173'),
  smtp: {
    host: getEnvVariable('SMTP_HOST', ''),
    port: getEnvNumber('SMTP_PORT', 587),
    user: getEnvVariable('SMTP_USER', ''),
    pass: getEnvVariable('SMTP_PASS', ''),
  },
  cloudinary: {
    cloudName: getEnvVariable('CLOUDINARY_CLOUD_NAME', ''),
    apiKey: getEnvVariable('CLOUDINARY_API_KEY', ''),
    apiSecret: getEnvVariable('CLOUDINARY_API_SECRET', ''),
  },
  aiApiKey: getEnvVariable('AI_API_KEY', ''),
};

export const isDevelopment = env.nodeEnv === 'development';
export const isProduction = env.nodeEnv === 'production';
