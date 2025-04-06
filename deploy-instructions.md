# Deployment Instructions for MCP Postmark Server

This document provides instructions for deploying the Model Context Protocol server for Postmark Email API.

## Deployment Options

There are several ways to deploy the MCP Postmark server:

1. **Local Deployment**: Run the server on your local machine
2. **Docker Deployment**: Containerize the server for easy deployment
3. **Cloud Deployment**: Deploy to a cloud provider like AWS, GCP, or Azure

## Local Deployment

For local deployment, follow these steps:

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your Postmark API token and configuration
4. Build the project:
   ```bash
   npm run build
   ```
5. Start the server:
   ```bash
   npm start
   ```

## Docker Deployment

To deploy using Docker:

1. Create a Dockerfile in the project root:

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:http"]
```

2. Build the Docker image:
```bash
docker build -t mcp-postmark-server .
```

3. Run the container:
```bash
docker run -p 3000:3000 --env-file .env mcp-postmark-server
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

## Monitoring and Maintenance

After deployment, it's important to monitor the server:

1. Set up logging to track errors and usage
2. Configure alerts for server downtime
3. Regularly update dependencies to maintain security

## Security Considerations

When deploying the server, consider these security best practices:

1. Store API tokens securely using environment variables
2. Use HTTPS for all communications
3. Implement rate limiting to prevent abuse
4. Regularly update dependencies to patch security vulnerabilities

## Scaling

If you need to scale the server for higher load:

1. Deploy multiple instances behind a load balancer
2. Use a process manager like PM2 for Node.js clustering
3. Consider serverless options for automatic scaling

## Troubleshooting

Common deployment issues:

1. **Connection refused**: Check if the server is running and the port is accessible
2. **Authentication errors**: Verify your Postmark API token
3. **CORS issues**: Configure CORS settings in the server for HTTP transport
