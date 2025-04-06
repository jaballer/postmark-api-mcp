import { PostmarkApiClient, PostmarkEmailRequest, PostmarkTemplateRequest } from './postmark-client';

/**
 * Interface for email formatter input from MCP
 */
export interface McpEmailInput {
  from: string;
  to: string;
  subject: string;
  textBody?: string;
  htmlBody?: string;
  cc?: string;
  bcc?: string;
  tag?: string;
  replyTo?: string;
  headers?: Array<{ name: string; value: string }>;
  trackOpens?: boolean;
  trackLinks?: string;
  attachments?: Array<{
    name: string;
    content: string;
    contentType: string;
  }>;
}

/**
 * Interface for template email input from MCP
 */
export interface McpTemplateInput {
  from: string;
  to: string;
  templateId: string;
  templateModel: Record<string, any>;
  inlineCss?: boolean;
  tag?: string;
  trackOpens?: boolean;
  trackLinks?: string;
}

/**
 * Email formatter to transform between MCP and Postmark formats
 */
export class EmailFormatter {
  /**
   * Format MCP email input to Postmark email request
   * @param input MCP email input
   * @returns Postmark email request
   */
  formatEmailRequest(input: McpEmailInput): PostmarkEmailRequest {
    // Transform headers from camelCase to PascalCase
    const headers = input.headers?.map(header => ({
      Name: header.name,
      Value: header.value
    }));

    // Transform attachments from camelCase to PascalCase
    const attachments = input.attachments?.map(attachment => ({
      Name: attachment.name,
      Content: attachment.content,
      ContentType: attachment.contentType
    }));

    // Return formatted Postmark request
    return {
      From: input.from,
      To: input.to,
      Subject: input.subject,
      TextBody: input.textBody,
      HtmlBody: input.htmlBody,
      Cc: input.cc,
      Bcc: input.bcc,
      Tag: input.tag,
      ReplyTo: input.replyTo,
      Headers: headers,
      TrackOpens: input.trackOpens,
      TrackLinks: input.trackLinks,
      Attachments: attachments
    };
  }

  /**
   * Format MCP template input to Postmark template request
   * @param input MCP template input
   * @returns Postmark template request
   */
  formatTemplateRequest(input: McpTemplateInput): PostmarkTemplateRequest {
    return {
      From: input.from,
      To: input.to,
      TemplateId: input.templateId,
      TemplateModel: input.templateModel,
      InlineCss: input.inlineCss,
      Tag: input.tag,
      TrackOpens: input.trackOpens,
      TrackLinks: input.trackLinks
    };
  }

  /**
   * Format Postmark response to MCP-friendly format
   * @param response Postmark response
   * @returns Formatted response for MCP
   */
  formatResponse(response: any): any {
    return {
      messageId: response.MessageID,
      to: response.To,
      submittedAt: response.SubmittedAt,
      status: response.ErrorCode === 0 ? 'sent' : 'error',
      errorMessage: response.ErrorCode !== 0 ? response.Message : undefined
    };
  }
}
