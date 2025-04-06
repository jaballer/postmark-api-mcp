import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { PostmarkMcpServer } from './mcp-server';
import { config } from './config';

/**
 * Main entry point for the MCP Postmark server
 */
async function main() {
  try {
    console.log('Starting MCP Postmark server...');
    
    // Create the MCP server for Postmark
    const postmarkServer = new PostmarkMcpServer();
    
    // Create Express app
    const app = express();
    
    // Middleware
    app.use(cors());
    app.use(bodyParser.json());
    
    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({ status: 'ok' });
    });
    
    // MCP endpoints
    app.post('/', async (req, res) => {
      try {
        const result = await postmarkServer.handleRequest(req.body);
        res.json(result);
      } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).json({
          jsonrpc: '2.0',
          error: {
            code: -32000,
            message: 'Internal server error'
          }
        });
      }
    });
    
    // Start the server
    const port = config.port;
    app.listen(port, () => {
      console.log(`MCP Postmark server running on port ${port}`);
    });
    
  } catch (error) {
    console.error('Failed to start MCP Postmark server:', error);
    process.exit(1);
  }
}

// Run the main function
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
