import { Client } from 'postmark';
import { config } from './config';

/**
 * Interface for Postmark email request
 */
export interface PostmarkEmailRequest {
  From: string;
  To: string;
  Subject: string;
  TextBody?: string;
  HtmlBody?: string;
  Cc?: string;
  Bcc?: string;
  Tag?: string;
  ReplyTo?: string;
  Headers?: Array<{ Name: string; Value: string }>;
  TrackOpens?: boolean;
  TrackLinks?: string;
  MessageStream?: string;
  Attachments?: Array<{
    Name: string;
    Content: string;
    ContentType: string;
  }>;
}

/**
 * Interface for Postmark email response
 */
export interface PostmarkEmailResponse {
  To: string;
  SubmittedAt: string;
  MessageID: string;
  ErrorCode: number;
  Message: string;
}

/**
 * Interface for Postmark template email request
 */
export interface PostmarkTemplateRequest {
  From: string;
  To: string;
  TemplateId: string;
  TemplateModel: Record<string, any>;
  InlineCss?: boolean;
  Tag?: string;
  TrackOpens?: boolean;
  TrackLinks?: string;
  MessageStream?: string;
}

export class PostmarkClient {
  private client: Client;

  constructor() {
    this.client = new Client(config.postmark.serverToken);
  }

  async sendEmail(params: {
    from: string;
    to: string;
    subject: string;
    textBody?: string;
    htmlBody?: string;
    trackOpens?: boolean;
  }) {
    try {
      const response = await this.client.sendEmail({
        From: params.from || config.postmark.defaultFromAddress,
        To: params.to,
        Subject: params.subject,
        TextBody: params.textBody,
        HtmlBody: params.htmlBody,
        TrackOpens: params.trackOpens,
        MessageStream: config.postmark.defaultMessageStream,
      });

      return {
        messageId: response.MessageID,
        to: response.To,
        submittedAt: response.SubmittedAt,
        status: 'sent',
      };
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendTemplateEmail(params: {
    from: string;
    to: string;
    templateId: number;
    templateModel: Record<string, any>;
  }) {
    try {
      const response = await this.client.sendEmailWithTemplate({
        From: params.from || config.postmark.defaultFromAddress,
        To: params.to,
        TemplateId: params.templateId,
        TemplateModel: params.templateModel,
        MessageStream: config.postmark.defaultMessageStream,
      });

      return {
        messageId: response.MessageID,
        to: response.To,
        submittedAt: response.SubmittedAt,
        status: 'sent',
      };
    } catch (error) {
      console.error('Error sending template email:', error);
      throw error;
    }
  }

  async sendBatchEmails(params: { emails: Array<{
    from: string;
    to: string;
    subject: string;
    textBody?: string;
    htmlBody?: string;
    trackOpens?: boolean;
  }>}) {
    try {
      const messages = params.emails.map(email => ({
        From: email.from || config.postmark.defaultFromAddress,
        To: email.to,
        Subject: email.subject,
        TextBody: email.textBody,
        HtmlBody: email.htmlBody,
        TrackOpens: email.trackOpens,
        MessageStream: config.postmark.defaultMessageStream,
      }));

      const responses = await this.client.sendEmailBatch(messages);

      return responses.map(response => ({
        messageId: response.MessageID,
        to: response.To,
        submittedAt: response.SubmittedAt,
        status: response.ErrorCode === 0 ? 'sent' : 'failed',
        error: response.ErrorCode !== 0 ? response.Message : undefined,
      }));
    } catch (error) {
      console.error('Error sending batch emails:', error);
      throw error;
    }
  }
}
