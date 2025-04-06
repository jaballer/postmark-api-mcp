// test-client.ts
import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

async function main() {
  console.log('Starting MCP Postmark server test client...');
  
  // Start the server process
  const serverProcess = spawn('npm', ['start'], {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..')
  });

  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  try {
    // Simulate MCP client requests
    
    // Test tools/list
    console.log('\nTesting tools/list...');
    const listRequest = {
      jsonrpc: "2.0",
      id: "list-request-123",
      method: "tools/list"
    };
    
    console.log('Request:', JSON.stringify(listRequest, null, 2));
    console.log('Expected response should include tools: send_email, send_template_email, send_batch_emails');
    
    // Test send_email tool
    console.log('\nTesting send_email tool...');
    const sendRequest = {
      jsonrpc: "2.0",
      id: "send-request-123",
      method: "tools/call",
      params: {
        name: "send_email",
        arguments: {
          from: "sender@example.com",
          to: "recipient@example.com",
          subject: "Test Email from MCP",
          textBody: "This is a test email sent via MCP.",
          htmlBody: "<html><body><p>This is a test email sent via MCP.</p></body></html>",
          trackOpens: true
        }
      }
    };
    
    console.log('Request:', JSON.stringify(sendRequest, null, 2));
    console.log('Expected response should indicate successful email sending with Postmark test token');
    
    // Write test results to file
    fs.writeFileSync(
      path.resolve(__dirname, '../test-results.md'),
      `# MCP Postmark Server Test Results

## Test Requests

### tools/list Request
\`\`\`json
${JSON.stringify(listRequest, null, 2)}
\`\`\`

### send_email Request
\`\`\`json
${JSON.stringify(sendRequest, null, 2)}
\`\`\`

## Manual Testing Instructions

Since we're using a simplified test client without direct MCP client library integration:

1. Start the server with: \`npm start\`
2. Use a tool like curl to send the above JSON-RPC requests to the server
3. For HTTP transport: \`npm run start:http\` and send requests to http://localhost:3000

## Expected Results

- The tools/list request should return a list of available tools including send_email, send_template_email, and send_batch_emails
- The send_email request should return a success response when using the Postmark test token
- Error cases should return appropriate error messages

## Test Validation

- Check the server console output for success/error messages
- Verify that when using a real Postmark token, emails are actually delivered
- Confirm that error handling works as expected with invalid inputs
`
    );
    
    console.log('\nTest documentation written to test-results.md');
    console.log('Manual testing is required to verify the server functionality');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    // Clean up
    console.log('\nCleaning up...');
    serverProcess.kill();
    console.log('Test completed');
  }
}

main().catch(console.error);
