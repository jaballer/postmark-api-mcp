import { JSONRPCServer } from 'json-rpc-2.0';
import { PostmarkClient } from './postmark-client';
import { config } from './config';

interface EmailParams {
  from: string;
  to: string;
  subject: string;
  textBody?: string;
  htmlBody?: string;
  trackOpens?: boolean;
}

interface TemplateEmailParams {
  from: string;
  to: string;
  templateId: number;
  templateModel: Record<string, any>;
}

interface BatchEmailParams {
  emails: EmailParams[];
}

/**
 * MCP Server implementation for Postmark
 */
export class PostmarkMcpServer {
  private server: JSONRPCServer;
  private postmarkClient: PostmarkClient;

  constructor() {
    this.postmarkClient = new PostmarkClient();
    this.server = new JSONRPCServer();

    // Register available tools
    this.registerTools();
  }

  private registerTools() {
    // Register email sending tool
    this.server.addMethod('send_email', async (params: EmailParams) => {
      return this.postmarkClient.sendEmail(params);
    });

    // Register template email sending tool
    this.server.addMethod('send_template_email', async (params: TemplateEmailParams) => {
      return this.postmarkClient.sendTemplateEmail(params);
    });

    // Register batch email sending tool
    this.server.addMethod('send_batch_emails', async (params: BatchEmailParams) => {
      return this.postmarkClient.sendBatchEmails(params);
    });
  }

  public async handleRequest(request: any) {
    try {
      return await this.server.receive(request);
    } catch (error) {
      console.error('Error handling request:', error);
      throw error;
    }
  }
}
