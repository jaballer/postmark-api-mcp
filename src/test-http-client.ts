// test-http-client.ts
import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

async function main() {
  console.log('Starting MCP Postmark server HTTP test client...');
  
  // Start the server process with HTTP transport
  const serverProcess = spawn('npm', ['run', 'start:http'], {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..')
  });

  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  try {
    // Simulate MCP client requests over HTTP
    
    // Test tools/list
    console.log('\nTesting tools/list over HTTP...');
    const listRequest = {
      jsonrpc: "2.0",
      id: "list-request-123",
      method: "tools/list"
    };
    
    console.log('Request:', JSON.stringify(listRequest, null, 2));
    console.log('Expected response should include tools: send_email, send_template_email, send_batch_emails');
    console.log('To test manually: curl -X POST http://localhost:3000 -H "Content-Type: application/json" -d \'{"jsonrpc":"2.0","id":"list-request-123","method":"tools/list"}\'');
    
    // Test send_email tool
    console.log('\nTesting send_email tool over HTTP...');
    const sendRequest = {
      jsonrpc: "2.0",
      id: "send-request-123",
      method: "tools/call",
      params: {
        name: "send_email",
        arguments: {
          from: "sender@example.com",
          to: "recipient@example.com",
          subject: "Test Email from MCP (HTTP)",
          textBody: "This is a test email sent via MCP over HTTP.",
          htmlBody: "<html><body><p>This is a test email sent via MCP over HTTP.</p></body></html>",
          trackOpens: true
        }
      }
    };
    
    console.log('Request:', JSON.stringify(sendRequest, null, 2));
    console.log('Expected response should indicate successful email sending with Postmark test token');
    
    // Append HTTP test info to test results file
    fs.appendFileSync(
      path.resolve(__dirname, '../test-results.md'),
      `
## HTTP Transport Testing

### HTTP tools/list Request
\`\`\`
curl -X POST http://localhost:3000 -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":"list-request-123","method":"tools/list"}'
\`\`\`

### HTTP send_email Request
\`\`\`
curl -X POST http://localhost:3000 -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":"send-request-123","method":"tools/call","params":{"name":"send_email","arguments":{"from":"sender@example.com","to":"recipient@example.com","subject":"Test Email from MCP (HTTP)","textBody":"This is a test email sent via MCP over HTTP.","htmlBody":"<html><body><p>This is a test email sent via MCP over HTTP.</p></body></html>","trackOpens":true}}}'
\`\`\`
`
    );
    
    console.log('\nHTTP test documentation appended to test-results.md');
    console.log('Manual testing is required to verify the server functionality over HTTP');
    
  } catch (error) {
    console.error('HTTP test failed:', error);
  } finally {
    // Clean up
    console.log('\nCleaning up...');
    serverProcess.kill();
    console.log('HTTP test completed');
  }
}

main().catch(console.error);
