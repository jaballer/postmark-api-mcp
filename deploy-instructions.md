# Deployment Instructions for MCP Postmark Server

This document provides instructions for deploying the Model Context Protocol server for Postmark Email API.

## Deployment Options

There are several ways to deploy the MCP Postmark server:

1. **Local Deployment**: Run the server on your local machine
2. **Docker Deployment**: Containerize the server for easy deployment
3. **Cloud Deployment**: Deploy to a cloud provider like AWS, GCP, or Azure

## Prerequisites

Before deploying, ensure you have:

1. Node.js 16 or higher installed
2. A Postmark account with an API token
3. Docker and Docker Compose (for containerized deployment)
4. Required environment variables:
   ```
   POSTMARK_SERVER_TOKEN=your_postmark_server_token
   DEFAULT_FROM_ADDRESS=your_default_sender@example.com
   DEFAULT_MESSAGE_STREAM=outbound
   PORT=3000
   RATE_LIMIT_MAX_REQUESTS=60
   ENABLE_LOGGING=true
   ```

## Local Deployment

### Development Mode

For local development, follow these steps:

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your Postmark API token and configuration
4. Start the development server with hot-reloading:
   ```bash
   npm run dev:http
   ```
5. Test the server with a sample email:
   ```bash
   curl -X POST http://localhost:3000 \
     -H "Content-Type: application/json" \
     -d '{
       "jsonrpc": "2.0",
       "id": "test-email-1",
       "method": "send_email",
       "params": {
         "from": "info@jabaltorres.com",
         "to": "jabaltorres@gmail.com",
         "subject": "Test Email",
         "textBody": "This is a test email from the MCP Postmark server"
       }
     }'
   ```

### Production Mode

For production deployment:

1. Build the project:
   ```bash
   npm run build
   ```
2. Start the server:
   ```bash
   npm start
   ```

## Docker Deployment

### Development Mode

1. Build and run with Docker Compose:
   ```bash
   docker-compose up --build
   ```
   This will:
   - Mount your local source code
   - Enable hot-reloading
   - Use development environment variables

### Production Mode

1. Build the Docker image:
   ```bash
   docker build -t mcp-postmark-server .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 \
     -e POSTMARK_SERVER_TOKEN=your_token \
     -e DEFAULT_FROM_ADDRESS=your_email@example.com \
     -e DEFAULT_MESSAGE_STREAM=outbound \
     -e PORT=3000 \
     -e RATE_LIMIT_MAX_REQUESTS=60 \
     -e ENABLE_LOGGING=true \
     mcp-postmark-server
   ```

## Cloud Deployment

### Deploying to Heroku

1. Create a Heroku account if you don't have one
2. Install the Heroku CLI
3. Login to Heroku:
   ```bash
   heroku login
   ```
4. Create a new Heroku app:
   ```bash
   heroku create mcp-postmark-server
   ```
5. Set environment variables:
   ```bash
   heroku config:set POSTMARK_SERVER_TOKEN=your_token
   heroku config:set DEFAULT_FROM_ADDRESS=your_email@example.com
   heroku config:set DEFAULT_MESSAGE_STREAM=outbound
   heroku config:set RATE_LIMIT_MAX_REQUESTS=60
   heroku config:set ENABLE_LOGGING=true
   ```
6. Deploy to Heroku:
   ```bash
   git push heroku main
   ```

### Deploying to AWS Lambda

1. Install the AWS CLI and configure it with your credentials
2. Create a Lambda function:
   ```bash
   aws lambda create-function \
     --function-name mcp-postmark-server \
     --runtime nodejs16.x \
     --handler index.handler \
     --zip-file fileb://deployment.zip
   ```
3. Set environment variables in the AWS Console
4. Configure API Gateway to expose your Lambda function

## Health Checks and Monitoring

The server includes a health check endpoint:

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{"status":"ok"}
```

Set up monitoring:

1. Configure logging to track:
   - Email delivery status
   - Error rates
   - API usage
   - Performance metrics

2. Set up alerts for:
   - Server downtime
   - High error rates
   - Rate limit approaching
   - Failed email deliveries

## Security Considerations

When deploying the server, consider these security best practices:

1. Store API tokens securely using environment variables
2. Use HTTPS for all communications
3. Implement rate limiting to prevent abuse
4. Regularly update dependencies to patch security vulnerabilities
5. Use secure message streams in Postmark
6. Implement proper error handling and logging

## Scaling

If you need to scale the server for higher load:

1. Deploy multiple instances behind a load balancer
2. Use a process manager like PM2 for Node.js clustering
3. Consider serverless options for automatic scaling
4. Monitor and adjust rate limits as needed
5. Implement caching where appropriate

## Troubleshooting

Common deployment issues:

1. **Connection refused**: 
   - Check if the server is running
   - Verify port accessibility
   - Check firewall settings

2. **Authentication errors**: 
   - Verify your Postmark API token
   - Check token permissions
   - Ensure environment variables are set correctly

3. **CORS issues**: 
   - Configure CORS settings in the server
   - Verify allowed origins
   - Check preflight requests

4. **Rate limiting**: 
   - Monitor rate limit headers
   - Adjust RATE_LIMIT_MAX_REQUESTS if needed
   - Implement retry logic with exponential backoff

5. **Email delivery issues**:
   - Check Postmark dashboard for delivery status
   - Verify sender domain configuration
   - Review email content for spam triggers

## Testing

### Testing Email Functionality

To verify that your server is working correctly, you can send a test email using curl:

```bash
curl -X POST http://localhost:3000 \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "test-email-1",
    "method": "send_email",
    "params": {
      "from": "info@jabaltorres.com",
      "to": "jabaltorres@gmail.com",
      "subject": "Test Email",
      "textBody": "This is a test email from the MCP Postmark server"
    }
  }'
```

Expected response:
```json
{
  "jsonrpc": "2.0",
  "id": "test-email-1",
  "result": {
    "messageId": "12345678-1234-1234-1234-123456789012",
    "status": "sent"
  }
}
```

### Testing Health Endpoint

You can also test the health endpoint:

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{"status":"ok"}
```
