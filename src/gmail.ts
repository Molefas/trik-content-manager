import { google } from 'googleapis';

export interface GmailCredentials {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

export function createGmailClient(credentials: GmailCredentials) {
  const oauth2Client = new google.auth.OAuth2(
    credentials.clientId,
    credentials.clientSecret
  );
  oauth2Client.setCredentials({
    refresh_token: credentials.refreshToken,
  });
  return google.gmail({ version: 'v1', auth: oauth2Client });
}

export interface EmailSummary {
  messageId: string;
  subject: string;
  from: string;
  date: string;
  snippet: string;
  links: string[];
}

export async function fetchEmailsFromSender(
  credentials: GmailCredentials,
  senderEmail: string,
  options: { maxResults?: number; sinceDate?: string } = {}
): Promise<EmailSummary[]> {
  const gmail = createGmailClient(credentials);
  const maxResults = options.maxResults || 10;

  // Build Gmail search query
  let query = `from:${senderEmail}`;
  if (options.sinceDate) {
    // Gmail uses YYYY/MM/DD format for after: filter
    const date = new Date(options.sinceDate);
    const formatted = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
    query += ` after:${formatted}`;
  }

  const listResponse = await gmail.users.messages.list({
    userId: 'me',
    q: query,
    maxResults,
  });

  const messages = listResponse.data.messages || [];
  const results: EmailSummary[] = [];

  for (const msg of messages) {
    const detail = await gmail.users.messages.get({
      userId: 'me',
      id: msg.id!,
      format: 'full',
    });

    const headers = detail.data.payload?.headers || [];
    const subject = headers.find((h) => h.name === 'Subject')?.value || '';
    const from = headers.find((h) => h.name === 'From')?.value || '';
    const date = headers.find((h) => h.name === 'Date')?.value || '';
    const snippet = detail.data.snippet || '';

    // Extract links from the email body
    const links = extractLinksFromPayload(detail.data.payload);

    results.push({
      messageId: msg.id!,
      subject,
      from,
      date,
      snippet,
      links: [...new Set(links)], // deduplicate
    });
  }

  return results;
}

function extractLinksFromPayload(payload: any): string[] {
  const links: string[] = [];
  if (!payload) return links;

  const body = getBodyFromPayload(payload);
  if (body) {
    // Extract URLs from HTML/text content
    const urlRegex = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/g;
    const matches = body.match(urlRegex) || [];
    // Filter out common non-article URLs
    const filtered = matches.filter(
      (url) =>
        !url.includes('unsubscribe') &&
        !url.includes('mailto:') &&
        !url.includes('list-manage') &&
        !url.includes('tracking') &&
        !url.includes('beacon') &&
        !url.includes('pixel')
    );
    links.push(...filtered);
  }

  return links;
}

function getBodyFromPayload(payload: any): string {
  if (payload.body?.data) {
    return Buffer.from(payload.body.data, 'base64').toString('utf-8');
  }

  if (payload.parts) {
    // Prefer HTML part, fall back to plain text
    const htmlPart = payload.parts.find(
      (p: any) => p.mimeType === 'text/html'
    );
    if (htmlPart?.body?.data) {
      return Buffer.from(htmlPart.body.data, 'base64').toString('utf-8');
    }

    const textPart = payload.parts.find(
      (p: any) => p.mimeType === 'text/plain'
    );
    if (textPart?.body?.data) {
      return Buffer.from(textPart.body.data, 'base64').toString('utf-8');
    }

    // Recursive for multipart
    for (const part of payload.parts) {
      const result = getBodyFromPayload(part);
      if (result) return result;
    }
  }

  return '';
}
