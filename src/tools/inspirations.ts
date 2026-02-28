import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import type { TrikStorage } from '../storage.js';
import { addInspirationToStorage, getInspirations, getInspirationById, filterInspirations } from '../storage.js';

export function createAddInspiration(storage: TrikStorage) {
  return tool(
    async (input) => {
      return JSON.stringify({ result: 'Not implemented' });
    },
    {
      name: 'addInspiration',
      description:
        'Store a new inspiration entry with title, description, URL, score, and source reference.',
      schema: z.object({
        sourceId: z.string().describe('ID of the parent source'),
        title: z.string().max(300).describe('Title of the inspiration'),
        description: z.string().max(1000).describe('Brief summary of the content'),
        url: z.string().url().max(500).describe('URL to the original content'),
        score: z.number().int().min(1).max(10).describe('Relevance score 1-10 based on user interests'),
      }),
    }
  );
}

export function createListInspirations(storage: TrikStorage) {
  return tool(
    async (input) => {
      return JSON.stringify({ result: 'Not implemented' });
    },
    {
      name: 'listInspirations',
      description:
        'Search and filter inspirations by query text, score range, date range, source, with sorting and limits.',
      schema: z.object({
        query: z.string().optional().describe('Search text to match against title and description'),
        minScore: z.number().int().min(1).max(10).optional().describe('Minimum score filter'),
        maxScore: z.number().int().min(1).max(10).optional().describe('Maximum score filter'),
        dateFrom: z.string().optional().describe('ISO date string - only include inspirations added after this date'),
        dateTo: z.string().optional().describe('ISO date string - only include inspirations added before this date'),
        sourceId: z.string().optional().describe('Filter by source ID'),
        sortBy: z.enum(['score', 'date']).optional().describe('Sort results by score (highest first) or date (newest first). Default: date'),
        limit: z.number().int().min(1).max(100).optional().describe('Max number of results to return. Default: 20'),
      }),
    }
  );
}

export function createGetInspiration(storage: TrikStorage) {
  return tool(
    async (input) => {
      return JSON.stringify({ result: 'Not implemented' });
    },
    {
      name: 'getInspiration',
      description: 'Get full details of a specific inspiration by ID.',
      schema: z.object({
        inspirationId: z.string().describe('ID of the inspiration to retrieve'),
      }),
    }
  );
}
