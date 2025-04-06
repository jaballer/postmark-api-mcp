import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

/**
 * Server configuration
 */
export const config = {
  // Postmark configuration
  postmark: {
    serverToken: process.env.POSTMARK_SERVER_TOKEN || 'POSTMARK_API_TEST',
    defaultFromAddress: process.env.DEFAULT_FROM_ADDRESS || '',
    defaultMessageStream: process.env.DEFAULT_MESSAGE_STREAM || 'outbound',
  },
  
  // MCP Server configuration
  mcp: {
    name: 'Postmark Email Server',
    version: '1.0.0',
  },
  
  // Security settings
  security: {
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '60', 10),
    enableLogging: process.env.ENABLE_LOGGING === 'true',
  },

  port: parseInt(process.env.PORT || '3000', 10),
};
