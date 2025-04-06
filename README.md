# Postmark MCP Server for Cursor

A Model Context Protocol (MCP) server that enables AI-powered email composition and sending through Postmark directly from Cursor.

## Features

- Send emails with AI-powered composition
- Use Postmark templates with dynamic content
- Send batch emails in a single request
- Real-time email validation
- Docker support for easy deployment
- Health check endpoint for monitoring

## Quick Start

1. Install the MCP server:
   ```bash
   chmod +x install.sh
   ./install.sh
   ```

2. Configure your Postmark API token in `.env`

3. Start the server:
   ```bash
   npm run dev:http
   ```

4. Open Cursor - the MCP will be automatically detected

## Using in Cursor

### Send an Email

```json
{
  "jsonrpc": "2.0",
  "id": "cursor-email-1",
  "method": "send_email",
  "params": {
    "from": "your@email.com",
    "to": "recipient@example.com",
    "subject": "Your AI-Generated Subject",
    "textBody": "Let Cursor help you write this email...",
    "htmlBody": "<p>Or use HTML formatting...</p>"
  }
}
```

### Use Templates

```json
{
  "jsonrpc": "2.0",
  "id": "cursor-template-1",
  "method": "send_template_email",
  "params": {
    "from": "your@email.com",
    "to": "recipient@example.com",
    "templateId": "your-template-id",
    "templateModel": {
      "name": "Recipient Name",
      "message": "Your message here"
    }
  }
}
```

## Configuration

Set these environment variables in your `.env` file:

```
POSTMARK_SERVER_TOKEN=your_postmark_server_token
DEFAULT_FROM_ADDRESS=your_default_sender@example.com
DEFAULT_MESSAGE_STREAM=outbound
PORT=3000
RATE_LIMIT_MAX_REQUESTS=60
ENABLE_LOGGING=true
```

## Development

### Local Development

```bash
npm install
npm run dev:http
```

### Docker Development

```bash
docker-compose up --build
```

### Production Deployment

```bash
docker build -t mcp-postmark-server .
docker run -p 3000:3000 \
  -e POSTMARK_SERVER_TOKEN=your_token \
  -e DEFAULT_FROM_ADDRESS=your_email@example.com \
  -e DEFAULT_MESSAGE_STREAM=outbound \
  -e PORT=3000 \
  -e RATE_LIMIT_MAX_REQUESTS=60 \
  -e ENABLE_LOGGING=true \
  mcp-postmark-server
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
