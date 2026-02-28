import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import type { TrikStorage } from '../storage.js';

export interface TrikConfig {
  get(key: string): string | undefined;
}

export function createFetchNewsletterEmails(storage: TrikStorage, config: TrikConfig) {
  return tool(
    async (input) => {
      return JSON.stringify({ result: 'Not implemented - Gmail integration pending' });
    },
    {
      name: 'fetchNewsletterEmails',
      description:
        'Fetch recent emails from a newsletter sender via Gmail API using OAuth2 credentials.',
      schema: z.object({
        sourceId: z.string().describe('ID of the newsletter source to fetch emails for'),
        maxResults: z.number().int().min(1).max(50).optional().describe('Max emails to fetch. Default: 10'),
        sinceDate: z.string().optional().describe('ISO date string - only fetch emails after this date'),
      }),
    }
  );
}
