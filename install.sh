#!/bin/bash

# Postmark MCP Server Installer
echo "Installing Postmark MCP Server..."

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "Node.js version must be 16 or higher. Current version: $(node -v)"
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "Please edit .env file with your Postmark API token and configuration"
fi

# Create cursor.json
echo "Creating Cursor configuration..."
cat > cursor.json << EOF
{
  "name": "Postmark MCP",
  "description": "Send emails through Postmark using AI-powered composition",
  "version": "1.0.0",
  "author": "Your Name",
  "repository": "https://github.com/yourusername/postmark-api-mcp",
  "keywords": ["postmark", "email", "mcp", "cursor"],
  "cursorVersion": ">=1.0.0"
}
EOF

echo "Installation complete!"
echo "To start the server:"
echo "1. Edit .env file with your Postmark API token"
echo "2. Run: npm run dev:http"
echo "3. Open Cursor and the MCP will be automatically detected" 