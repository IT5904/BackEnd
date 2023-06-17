import dotenv from 'dotenv';

dotenv.config();

export const config = {
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 8080,

  app: {
    jsonLimit: '10mb',
    api_prefix: '/tocen-api',
  },

  database_url: process.env.DB_CONN_STRING,
  db_name: process.env.DB_NAME,
  redis_url: process.env.REDIS_HOST,
  redis_password: process.env.REDIS_PASSWORD,
  redis_port: process.env.REDIS_PORT,
  timezone: process.env.TZ,

  jwt_secret: process.env.JWT_SECRET,
  jwt_expires_in: process.env.ACCESS_TOKEN_TIMEOUT,
  refresh_expires_in: process.env.REFRESH_TOKEN_TIMEOUT,
  login_message: process.env.LOGIN_MESSAGE,

  email: {
    sender: process.env.SENDER,
    api_key: process.env.EMAIL_API_KEY,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
  },
};
