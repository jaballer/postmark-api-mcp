# Model Context Protocol Server for Postmark Email API - Data Flow Design

## Overview

This document details the data flow between the Model Context Protocol (MCP) server and the Postmark Email API, focusing on how data is transformed and passed between components.

## Email Sending Flow

### 1. MCP Client to MCP Server

**Request from MCP Client:**
```json
{
  "jsonrpc": "2.0",
  "id": "request-123",
  "method": "tools/call",
  "params": {
    "name": "send_email",
    "arguments": {
      "from": "sender@example.com",
      "to": "recipient@example.com",
      "subject": "Hello from MCP",
      "textBody": "This is a test email sent via MCP.",
      "htmlBody": "<html><body><p>This is a test email sent via MCP.</p></body></html>",
      "trackOpens": true
    }
  }
}
```

### 2. MCP Server to Email Formatter

The Email Formatter transforms the MCP tool arguments into a format compatible with the Postmark API:

**Transformed Data:**
```json
{
  "From": "sender@example.com",
  "To": "recipient@example.com",
  "Subject": "Hello from MCP",
  "TextBody": "This is a test email sent via MCP.",
  "HtmlBody": "<html><body><p>This is a test email sent via MCP.</p></body></html>",
  "TrackOpens": true,
  "MessageStream": "outbound"
}
```

### 3. Authentication Handler to Postmark API Client

The Authentication Handler adds the necessary authentication headers:

**Headers:**
```
Content-Type: application/json
Accept: application/json
X-Postmark-Server-Token: [SERVER_TOKEN]
```

### 4. Postmark API Client to Postmark API

The Postmark API Client sends an HTTP POST request to the Postmark API:

**HTTP Request:**
```
POST https://api.postmarkapp.com/email
Headers: {
  "Content-Type": "application/json",
  "Accept": "application/json",
  "X-Postmark-Server-Token": "[SERVER_TOKEN]"
}
Body: {
  "From": "sender@example.com",
  "To": "recipient@example.com",
  "Subject": "Hello from MCP",
  "TextBody": "This is a test email sent via MCP.",
  "HtmlBody": "<html><body><p>This is a test email sent via MCP.</p></body></html>",
  "TrackOpens": true,
  "MessageStream": "outbound"
}
```

### 5. Postmark API to Postmark API Client

Postmark API responds with a success or error message:

**Success Response:**
```json
{
  "To": "recipient@example.com",
  "SubmittedAt": "2025-03-30T18:00:00.0000000-04:00",
  "MessageID": "b7bc2f4a-e38e-4336-af7d-e6c392c2f817",
  "ErrorCode": 0,
  "Message": "OK"
}
```

### 6. Postmark API Client to MCP Server

The Postmark API Client processes the response and passes it to the MCP Server:

**Processed Response:**
```json
{
  "messageId": "b7bc2f4a-e38e-4336-af7d-e6c392c2f817",
  "status": "sent",
  "to": "recipient@example.com",
  "submittedAt": "2025-03-30T18:00:00.0000000-04:00"
}
```

### 7. MCP Server to MCP Client

The MCP Server formats the response according to the MCP specification:

**MCP Response:**
```json
{
  "jsonrpc": "2.0",
  "id": "request-123",
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Email sent successfully to recipient@example.com with ID b7bc2f4a-e38e-4336-af7d-e6c392c2f817"
      }
    ],
    "isError": false
  }
}
```

## Error Handling Flow

### 1. Postmark API Error Response

If Postmark returns an error:

```json
{
  "ErrorCode": 300,
  "Message": "Invalid email request"
}
```

### 2. Error Handler Processing

The Error Handler translates this to an MCP-compatible error:

```json
{
  "jsonrpc": "2.0",
  "id": "request-123",
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Failed to send email: Invalid email request (Postmark error code: 300)"
      }
    ],
    "isError": true
  }
}
```

## Tool Definition Flow

### 1. MCP Client Requests Available Tools

**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": "list-request-123",
  "method": "tools/list"
}
```

### 2. MCP Server Responds with Tool Definitions

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": "list-request-123",
  "result": {
    "tools": [
      {
        "name": "send_email",
        "description": "Send an email through Postmark",
        "inputSchema": {
          "type": "object",
          "properties": {
            "from": {
              "type": "string",
              "description": "Sender email address"
            },
            "to": {
              "type": "string",
              "description": "Recipient email address"
            },
            "subject": {
              "type": "string",
              "description": "Email subject"
            },
            "textBody": {
              "type": "string",
              "description": "Plain text email body"
            },
            "htmlBody": {
              "type": "string",
              "description": "HTML email body"
            },
            "trackOpens": {
              "type": "boolean",
              "description": "Whether to track email opens",
              "default": false
            }
          },
          "required": ["from", "to", "subject"]
        }
      },
      {
        "name": "send_template_email",
        "description": "Send an email using a Postmark template",
        "inputSchema": {
          "type": "object",
          "properties": {
            "from": {
              "type": "string",
              "description": "Sender email address"
            },
            "to": {
              "type": "string",
              "description": "Recipient email address"
            },
            "templateId": {
              "type": "string",
              "description": "Postmark template ID"
            },
            "templateModel": {
              "type": "object",
              "description": "Template variables"
            },
            "trackOpens": {
              "type": "boolean",
              "description": "Whether to track email opens",
              "default": false
            }
          },
          "required": ["from", "to", "templateId", "templateModel"]
        }
      }
    ]
  }
}
```

## Data Transformation Rules

1. **Email Address Formatting**:
   - MCP: `from`, `to`, `cc`, `bcc` (lowercase)
   - Postmark: `From`, `To`, `Cc`, `Bcc` (capitalized)

2. **Email Body Formatting**:
   - MCP: `textBody`, `htmlBody` (camelCase)
   - Postmark: `TextBody`, `HtmlBody` (PascalCase)

3. **Tracking Options**:
   - MCP: `trackOpens`, `trackLinks` (camelCase)
   - Postmark: `TrackOpens`, `TrackLinks` (PascalCase)

4. **Attachments**:
   - MCP: Array of objects with `name`, `content`, `contentType`
   - Postmark: Array of objects with `Name`, `Content`, `ContentType`

5. **Error Handling**:
   - Postmark errors are translated to MCP error responses
   - HTTP errors are wrapped in appropriate MCP error responses

## Configuration Parameters

1. **Server Configuration**:
   - `POSTMARK_SERVER_TOKEN`: API token for Postmark
   - `MCP_SERVER_NAME`: Name of the MCP server
   - `MCP_SERVER_VERSION`: Version of the MCP server

2. **Email Defaults**:
   - `DEFAULT_MESSAGE_STREAM`: Default message stream (usually "outbound")
   - `DEFAULT_FROM_ADDRESS`: Default sender address (optional)

3. **Security Settings**:
   - `RATE_LIMIT_MAX_REQUESTS`: Maximum number of requests per minute
   - `ENABLE_LOGGING`: Whether to enable detailed logging

## Implementation Notes

1. All data transformations should be handled by the Email Formatter component
2. Validation should occur before sending to Postmark to catch errors early
3. Sensitive information (like API tokens) should never be included in responses
4. All errors should be logged for debugging purposes
