# Model Context Protocol Server for Postmark Email API - Test Plan

## Overview

This document outlines the testing approach for the MCP Postmark server implementation. The tests will verify that the server correctly implements the Model Context Protocol and integrates properly with the Postmark Email API.

## Test Environment Setup

1. Create a `.env` file with test configuration
2. Use Postmark's test mode with `POSTMARK_API_TEST` token
3. Set up a test MCP client to interact with the server

## Test Cases

### 1. Server Initialization Tests

- **Test Server Startup (stdio)**: Verify the server starts correctly with stdio transport
- **Test Server Startup (HTTP)**: Verify the server starts correctly with HTTP transport
- **Test Configuration Loading**: Verify the server loads configuration from environment variables

### 2. Tool Discovery Tests

- **Test Tools List**: Verify the server correctly responds to `tools/list` requests
- **Test Tool Schemas**: Verify the tool schemas match the expected definitions

### 3. Email Sending Tests

- **Test Send Email**: Verify the `send_email` tool correctly sends emails
- **Test Send Template Email**: Verify the `send_template_email` tool correctly sends template emails
- **Test Send Batch Emails**: Verify the `send_batch_emails` tool correctly sends multiple emails

### 4. Error Handling Tests

- **Test Missing Required Fields**: Verify appropriate error responses for missing required fields
- **Test Invalid Email Addresses**: Verify appropriate error responses for invalid email addresses
- **Test API Error Handling**: Verify Postmark API errors are properly translated to MCP errors

## Test Scripts

### Test Client Script

```typescript
// test-client.ts
import { McpClient } from '@modelcontextprotocol/sdk/client/mcp.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'child_process';
import { once } from 'events';

async function main() {
  // Start the server process
  const serverProcess = spawn('npm', ['start'], {
    stdio: ['pipe', 'pipe', 'pipe']
  });

  // Create client transport connected to server process
  const transport = new StdioClientTransport({
    stdin: serverProcess.stdin,
    stdout: serverProcess.stdout
  });

  // Create MCP client
  const client = new McpClient();
  await client.connect(transport);

  try {
    // Test tools/list
    console.log('Testing tools/list...');
    const tools = await client.listTools();
    console.log('Available tools:', tools.map(t => t.name));

    // Test send_email tool
    console.log('\nTesting send_email tool...');
    const sendResult = await client.callTool('send_email', {
      from: 'sender@example.com',
      to: 'recipient@example.com',
      subject: 'Test Email from MCP',
      textBody: 'This is a test email sent via MCP.',
      htmlBody: '<html><body><p>This is a test email sent via MCP.</p></body></html>',
      trackOpens: true
    });
    console.log('Send email result:', sendResult);

    // Test send_template_email tool
    console.log('\nTesting send_template_email tool...');
    const templateResult = await client.callTool('send_template_email', {
      from: 'sender@example.com',
      to: 'recipient@example.com',
      templateId: 'template_id',
      templateModel: {
        name: 'Test User',
        message: 'Hello from MCP!'
      }
    });
    console.log('Send template email result:', templateResult);

    // Test send_batch_emails tool
    console.log('\nTesting send_batch_emails tool...');
    const batchResult = await client.callTool('send_batch_emails', {
      emails: [
        {
          from: 'sender@example.com',
          to: 'recipient1@example.com',
          subject: 'Test Batch Email 1',
          textBody: 'This is test batch email 1.'
        },
        {
          from: 'sender@example.com',
          to: 'recipient2@example.com',
          subject: 'Test Batch Email 2',
          textBody: 'This is test batch email 2.'
        }
      ]
    });
    console.log('Send batch emails result:', batchResult);

    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    // Clean up
    await client.disconnect();
    serverProcess.kill();
  }
}

main().catch(console.error);
```

### HTTP Test Script

```typescript
// test-http-client.ts
import { McpClient } from '@modelcontextprotocol/sdk/client/mcp.js';
import { HttpClientTransport } from '@modelcontextprotocol/sdk/client/http.js';
import { spawn } from 'child_process';

async function main() {
  // Start the server process with HTTP transport
  const serverProcess = spawn('npm', ['run', 'start:http'], {
    stdio: 'inherit'
  });

  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Create client transport connected to HTTP server
  const transport = new HttpClientTransport({
    url: 'http://localhost:3000'
  });

  // Create MCP client
  const client = new McpClient();
  await client.connect(transport);

  try {
    // Test tools/list
    console.log('Testing tools/list...');
    const tools = await client.listTools();
    console.log('Available tools:', tools.map(t => t.name));

    // Test send_email tool
    console.log('\nTesting send_email tool...');
    const sendResult = await client.callTool('send_email', {
      from: 'sender@example.com',
      to: 'recipient@example.com',
      subject: 'Test Email from MCP (HTTP)',
      textBody: 'This is a test email sent via MCP over HTTP.',
      htmlBody: '<html><body><p>This is a test email sent via MCP over HTTP.</p></body></html>',
      trackOpens: true
    });
    console.log('Send email result:', sendResult);

    console.log('\nHTTP tests completed successfully!');
  } catch (error) {
    console.error('HTTP test failed:', error);
  } finally {
    // Clean up
    await client.disconnect();
    serverProcess.kill();
  }
}

main().catch(console.error);
```

## Test Execution

1. Create a `.env` file with test configuration:
   ```
   POSTMARK_SERVER_TOKEN=POSTMARK_API_TEST
   DEFAULT_FROM_ADDRESS=sender@example.com
   DEFAULT_MESSAGE_STREAM=outbound
   PORT=3000
   ENABLE_LOGGING=true
   ```

2. Run the stdio transport tests:
   ```
   ts-node test-client.ts
   ```

3. Run the HTTP transport tests:
   ```
   ts-node test-http-client.ts
   ```

## Expected Results

- All tools should be correctly listed
- Email sending operations should return success responses
- Error cases should return appropriate error messages
- The server should handle both stdio and HTTP transports correctly

## Test Validation

- Check the console output for success/error messages
- Verify that when using a real Postmark token, emails are actually delivered
- Confirm that error handling works as expected with invalid inputs
