import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { PostmarkApiClient } from './postmark-client';
import { EmailFormatter, McpEmailInput, McpTemplateInput } from './email-formatter';
import { config } from './config';

/**
 * MCP Server implementation for Postmark
 */
export class PostmarkMcpServer {
  private server: McpServer;
  private postmarkClient: PostmarkApiClient;
  private emailFormatter: EmailFormatter;

  constructor() {
    // Initialize MCP server
    this.server = new McpServer({
      name: config.mcp.name,
      version: config.mcp.version
    });

    // Initialize Postmark client and email formatter
    this.postmarkClient = new PostmarkApiClient();
    this.emailFormatter = new EmailFormatter();

    // Register tools
    this.registerTools();
  }

  /**
   * Register all email tools with the MCP server
   */
  private registerTools(): void {
    this.registerSendEmailTool();
    this.registerSendTemplateEmailTool();
    this.registerSendBatchEmailsTool();
  }

  /**
   * Register the send_email tool
   */
  private registerSendEmailTool(): void {
    this.server.tool(
      'send_email',
      'Send an email through Postmark',
      async (args) => {
        try {
          const params = args as unknown as McpEmailInput;
          
          // Use default from address if not provided
          if (!params.from && config.postmark.defaultFromAddress) {
            params.from = config.postmark.defaultFromAddress;
          }

          // Format the request for Postmark
          const postmarkRequest = this.emailFormatter.formatEmailRequest(params);
          
          // Send the email
          const response = await this.postmarkClient.sendEmail(postmarkRequest);
          
          // Format the response for MCP
          const formattedResponse = this.emailFormatter.formatResponse(response);
          
          return {
            content: [
              {
                type: 'text',
                text: `Email sent successfully to ${formattedResponse.to} with ID ${formattedResponse.messageId}`
              }
            ],
            isError: false
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to send email: ${error instanceof Error ? error.message : String(error)}`
              }
            ],
            isError: true
          };
        }
      }
    );
  }

  /**
   * Register the send_template_email tool
   */
  private registerSendTemplateEmailTool(): void {
    this.server.tool(
      'send_template_email',
      'Send an email using a Postmark template',
      async (args) => {
        try {
          const params = args as unknown as McpTemplateInput;
          
          // Use default from address if not provided
          if (!params.from && config.postmark.defaultFromAddress) {
            params.from = config.postmark.defaultFromAddress;
          }

          // Format the request for Postmark
          const postmarkRequest = this.emailFormatter.formatTemplateRequest(params);
          
          // Send the template email
          const response = await this.postmarkClient.sendTemplateEmail(postmarkRequest);
          
          // Format the response for MCP
          const formattedResponse = this.emailFormatter.formatResponse(response);
          
          return {
            content: [
              {
                type: 'text',
                text: `Template email sent successfully to ${formattedResponse.to} with ID ${formattedResponse.messageId}`
              }
            ],
            isError: false
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to send template email: ${error instanceof Error ? error.message : String(error)}`
              }
            ],
            isError: true
          };
        }
      }
    );
  }

  /**
   * Register the send_batch_emails tool
   */
  private registerSendBatchEmailsTool(): void {
    this.server.tool(
      'send_batch_emails',
      'Send multiple emails in a batch',
      async (args) => {
        try {
          const params = args as unknown as { emails: McpEmailInput[] };
          
          // Format each email for Postmark
          const postmarkRequests = params.emails.map(email => {
            // Use default from address if not provided
            if (!email.from && config.postmark.defaultFromAddress) {
              email.from = config.postmark.defaultFromAddress;
            }
            return this.emailFormatter.formatEmailRequest(email);
          });
          
          // Send batch emails
          const responses = await this.postmarkClient.sendBatchEmails(postmarkRequests);
          
          // Format the responses for MCP
          const formattedResponses = responses.map(response => this.emailFormatter.formatResponse(response));
          
          // Count successful and failed emails
          const successful = formattedResponses.filter(r => r.status === 'sent').length;
          const failed = formattedResponses.length - successful;
          
          return {
            content: [
              {
                type: 'text',
                text: `Batch email sending completed: ${successful} successful, ${failed} failed`
              }
            ],
            isError: failed > 0
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to send batch emails: ${error instanceof Error ? error.message : String(error)}`
              }
            ],
            isError: true
          };
        }
      }
    );
  }

  /**
   * Get the MCP server instance
   * @returns The MCP server instance
   */
  getServer(): McpServer {
    return this.server;
  }
}
