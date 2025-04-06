import axios from 'axios';
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

/**
 * Postmark API client for sending emails
 */
export class PostmarkApiClient {
  private readonly baseUrl = 'https://api.postmarkapp.com';
  private readonly headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Postmark-Server-Token': config.postmark.serverToken
  };

  /**
   * Send a single email through Postmark
   * @param emailRequest The email request data
   * @returns Promise with the email response
   */
  async sendEmail(emailRequest: PostmarkEmailRequest): Promise<PostmarkEmailResponse> {
    try {
      // Set default message stream if not provided
      if (!emailRequest.MessageStream) {
        emailRequest.MessageStream = config.postmark.defaultMessageStream;
      }

      const response = await axios.post<PostmarkEmailResponse>(
        `${this.baseUrl}/email`,
        emailRequest,
        { headers: this.headers }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Handle Postmark API errors
        const errorData = error.response.data;
        throw new Error(`Postmark API error: ${errorData.Message} (Code: ${errorData.ErrorCode})`);
      }
      throw new Error(`Failed to send email: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Send a batch of emails through Postmark
   * @param emailRequests Array of email request data
   * @returns Promise with array of email responses
   */
  async sendBatchEmails(emailRequests: PostmarkEmailRequest[]): Promise<PostmarkEmailResponse[]> {
    try {
      // Set default message stream if not provided for each email
      emailRequests.forEach(email => {
        if (!email.MessageStream) {
          email.MessageStream = config.postmark.defaultMessageStream;
        }
      });

      const response = await axios.post<PostmarkEmailResponse[]>(
        `${this.baseUrl}/email/batch`,
        emailRequests,
        { headers: this.headers }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Handle Postmark API errors
        const errorData = error.response.data;
        throw new Error(`Postmark API error: ${errorData.Message} (Code: ${errorData.ErrorCode})`);
      }
      throw new Error(`Failed to send batch emails: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Send an email using a Postmark template
   * @param templateRequest The template request data
   * @returns Promise with the email response
   */
  async sendTemplateEmail(templateRequest: PostmarkTemplateRequest): Promise<PostmarkEmailResponse> {
    try {
      // Set default message stream if not provided
      if (!templateRequest.MessageStream) {
        templateRequest.MessageStream = config.postmark.defaultMessageStream;
      }

      const response = await axios.post<PostmarkEmailResponse>(
        `${this.baseUrl}/email/withTemplate`,
        templateRequest,
        { headers: this.headers }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Handle Postmark API errors
        const errorData = error.response.data;
        throw new Error(`Postmark API error: ${errorData.Message} (Code: ${errorData.ErrorCode})`);
      }
      throw new Error(`Failed to send template email: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
