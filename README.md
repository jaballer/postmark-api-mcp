# Model Context Protocol Server for Postmark Email API

This server implements the [Model Context Protocol (MCP)](https://spec.modelcontextprotocol.io/) for the [Postmark Email API](https://postmarkapp.com/developer/api/email-api), allowing language models to send emails through Postmark using a standardized protocol.

## Features

- Send single emails through Postmark
- Send template-based emails using Postmark templates
- Send batch emails in a single request
- Support for both stdio and HTTP transports
- Configurable via environment variables
- Error handling and validation

## Prerequisites

- Node.js 16 or higher
- npm or yarn
- A Postmark account with an API token

## Installation

1. Clone the repository or download the source code
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on the `.env.example` template:

```bash
cp .env.example .env
```

4. Edit the `.env` file to add your Postmark API token and other configuration options:

```
POSTMARK_SERVER_TOKEN=your_postmark_server_token
DEFAULT_FROM_ADDRESS=your_default_sender@example.com
DEFAULT_MESSAGE_STREAM=outbound
PORT=3000
RATE_LIMIT_MAX_REQUESTS=60
ENABLE_LOGGING=true
```

## Usage

### Starting the Server

#### With stdio transport (default):

```bash
npm start
```

#### With HTTP transport:

```bash
npm run start:http
```

### Interacting with the Server

The server implements the Model Context Protocol, which uses JSON-RPC 2.0 for communication. You can interact with it using any MCP client or by sending JSON-RPC requests directly.

#### Available Tools

The server provides the following tools:

1. `send_email` - Send a single email
2. `send_template_email` - Send an email using a Postmark template
3. `send_batch_emails` - Send multiple emails in a batch

#### Example Requests

##### List Available Tools

```json
{
  "jsonrpc": "2.0",
  "id": "list-request-123",
  "method": "tools/list"
}
```

##### Send an Email

```json
{
  "jsonrpc": "2.0",
  "id": "send-request-123",
  "method": "tools/call",
  "params": {
    "name": "send_email",
    "arguments": {
      "from": "sender@example.com",
      "to": "recipient@example.com",
      "subject": "Test Email from MCP",
      "textBody": "This is a test email sent via MCP.",
      "htmlBody": "<html><body><p>This is a test email sent via MCP.</p></body></html>",
      "trackOpens": true
    }
  }
}
```

##### Send a Template Email

```json
{
  "jsonrpc": "2.0",
  "id": "template-request-123",
  "method": "tools/call",
  "params": {
    "name": "send_template_email",
    "arguments": {
      "from": "sender@example.com",
      "to": "recipient@example.com",
      "templateId": "template_id",
      "templateModel": {
        "name": "Test User",
        "message": "Hello from MCP!"
      }
    }
  }
}
```

##### Send Batch Emails

```json
{
  "jsonrpc": "2.0",
  "id": "batch-request-123",
  "method": "tools/call",
  "params": {
    "name": "send_batch_emails",
    "arguments": {
      "emails": [
        {
          "from": "sender@example.com",
          "to": "recipient1@example.com",
          "subject": "Test Batch Email 1",
          "textBody": "This is test batch email 1."
        },
        {
          "from": "sender@example.com",
          "to": "recipient2@example.com",
          "subject": "Test Batch Email 2",
          "textBody": "This is test batch email 2."
        }
      ]
    }
  }
}
```

### HTTP Transport

When using the HTTP transport, send POST requests to the server's endpoint (default: http://localhost:3000) with the JSON-RPC request in the body:

```bash
curl -X POST http://localhost:3000 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":"list-request-123","method":"tools/list"}'
```

## Configuration Options

The server can be configured using environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `POSTMARK_SERVER_TOKEN` | Your Postmark API token | `POSTMARK_API_TEST` |
| `DEFAULT_FROM_ADDRESS` | Default sender email address | (empty) |
| `DEFAULT_MESSAGE_STREAM` | Default Postmark message stream | `outbound` |
| `PORT` | HTTP server port | `3000` |
| `RATE_LIMIT_MAX_REQUESTS` | Maximum requests per minute | `60` |
| `ENABLE_LOGGING` | Enable detailed logging | `true` |

## Development

### Building the Project

```bash
npm run build
```

### Running Tests

```bash
npm test
```

## Architecture

The server follows a modular architecture with the following components:

1. **MCP Server**: Core component implementing the Model Context Protocol
2. **Postmark API Client**: Handles communication with the Postmark Email API
3. **Email Formatter**: Transforms between MCP tool parameters and Postmark API format
4. **Configuration Manager**: Manages server configuration

For more details, see the [architecture documentation](./design/architecture.md) and [data flow documentation](./design/data_flow.md).

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
