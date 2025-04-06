import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { PostmarkMcpServer } from './mcp-server';

/**
 * Main entry point for the MCP Postmark server
 */
async function main() {
  try {
    console.log('Starting MCP Postmark server...');
    
    // Create the MCP server for Postmark
    const postmarkServer = new PostmarkMcpServer();
    const mcpServer = postmarkServer.getServer();
    
    // Determine transport type from command line arguments
    const args = process.argv.slice(2);
    const useHttp = args.includes('--http');
    
    if (useHttp) {
      // Use HTTP transport
      const port = parseInt(process.env.PORT || '3000', 10);
      console.log(`Starting HTTP server on port ${port}...`);
      
      try {
        // Note: This would normally use HttpServerTransport, but we're using stdio for testing
        console.log('HTTP transport not available in test environment, falling back to stdio');
        const transport = new StdioServerTransport();
        await mcpServer.connect(transport);
        console.log('MCP Postmark server running with stdio transport (HTTP fallback)');
      } catch (error) {
        console.error('Failed to start transport:', error);
        console.log('Falling back to stdio transport...');
        
        const transport = new StdioServerTransport();
        await mcpServer.connect(transport);
        console.log('MCP Postmark server running with stdio transport');
      }
    } else {
      // Use stdio transport (default)
      console.log('Starting with stdio transport...');
      const transport = new StdioServerTransport();
      await mcpServer.connect(transport);
      console.log('MCP Postmark server running with stdio transport');
    }
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
