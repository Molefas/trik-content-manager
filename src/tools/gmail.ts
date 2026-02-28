import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import type { TrikStorage } from '../storage.js';
import { getSources, updateSourceScanTime } from '../storage.js';
import { fetchEmailsFromSender } from '../gmail.js';

export interface TrikConfig {
  get(key: string): string | undefined;
}

export function createFetchNewsletterEmails(storage: TrikStorage, config: TrikConfig) {
  return tool(
    async (input) => {
      // Get the source to find the sender email
      const sources = await getSources(storage);
      const source = sources.find((s) => s.id === input.sourceId);

      if (!source) {
        return JSON.stringify({
          error: 'Source not found',
          sourceId: input.sourceId,
          status: 'error',
        });
      }

      if (source.type !== 'newsletter') {
        return JSON.stringify({
          error: 'Source is not a newsletter',
          sourceId: input.sourceId,
          sourceType: source.type,
          status: 'error',
        });
      }

      // Get Gmail credentials from config
      const clientId = config.get('gmail_client_id');
      const clientSecret = config.get('gmail_client_secret');
      const refreshToken = config.get('gmail_refresh_token');

      if (!clientId || !clientSecret || !refreshToken) {
        return JSON.stringify({
          error: 'Gmail credentials not configured. Set gmail_client_id, gmail_client_secret, and gmail_refresh_token in trik config.',
          status: 'auth_error',
        });
      }

      try {
        const emails = await fetchEmailsFromSender(
          { clientId, clientSecret, refreshToken },
          source.identifier,
          {
            maxResults: input.maxResults,
            sinceDate: input.sinceDate || source.lastScannedAt || undefined,
          }
        );

        // Update the source's last scanned time
        await updateSourceScanTime(storage, source.id);

        if (emails.length === 0) {
          return JSON.stringify({
            senderEmail: source.identifier,
            emailCount: 0,
            status: 'no_emails',
            emails: [],
          });
        }

        return JSON.stringify({
          senderEmail: source.identifier,
          emailCount: emails.length,
          status: 'success',
          emails: emails.map((e) => ({
            subject: e.subject,
            date: e.date,
            snippet: e.snippet,
            links: e.links,
          })),
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return JSON.stringify({
          error: message,
          senderEmail: source.identifier,
          emailCount: 0,
          status: 'error',
        });
      }
    },
    {
      name: 'fetchNewsletterEmails',
      description:
        'Fetch recent emails from a newsletter sender via Gmail API using OAuth2 credentials.',
      schema: z.object({
        sourceId: z.string().describe('ID of the newsletter source to fetch emails for'),
        maxResults: z.number().int().min(1).max(50).optional().describe('Max emails to fetch. Default: 10'),
        sinceDate: z.string().optional().describe('ISO date - only fetch emails after this date'),
      }),
    }
  );
}
