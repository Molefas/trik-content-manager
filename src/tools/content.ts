import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import type { TrikStorage } from '../storage.js';
import { addContentToStorage, getContentList, getContentById, updateContentInStorage, filterContent } from '../storage.js';

export function createCreateContent(storage: TrikStorage) {
  return tool(
    async (input) => {
      return JSON.stringify({ result: 'Not implemented' });
    },
    {
      name: 'createContent',
      description:
        'Store a newly generated piece of content (article, LinkedIn post, or X post) as a draft.',
      schema: z.object({
        type: z.enum(['article', 'linkedin', 'x_post']).describe('Type of content to create'),
        title: z.string().max(300).describe('Title of the content'),
        body: z.string().describe('The full generated content body'),
        inspirationIds: z.array(z.string()).describe('IDs of inspirations this content is based on'),
        userPrompt: z.string().describe('The original user request that prompted this content'),
      }),
    }
  );
}

export function createListContent(storage: TrikStorage) {
  return tool(
    async (input) => {
      return JSON.stringify({ result: 'Not implemented' });
    },
    {
      name: 'listContent',
      description: 'List created content filtered by status (draft/done) and/or content type.',
      schema: z.object({
        status: z.enum(['draft', 'done']).optional().describe('Filter by content status'),
        type: z.enum(['article', 'linkedin', 'x_post']).optional().describe('Filter by content type'),
      }),
    }
  );
}

export function createGetContent(storage: TrikStorage) {
  return tool(
    async (input) => {
      return JSON.stringify({ result: 'Not implemented' });
    },
    {
      name: 'getContent',
      description: 'Get full content details including body text by content ID.',
      schema: z.object({
        contentId: z.string().describe('ID of the content to retrieve'),
      }),
    }
  );
}

export function createUpdateContent(storage: TrikStorage) {
  return tool(
    async (input) => {
      return JSON.stringify({ result: 'Not implemented' });
    },
    {
      name: 'updateContent',
      description: 'Update content body text (iteration) or status (mark as done).',
      schema: z.object({
        contentId: z.string().describe('ID of the content to update'),
        body: z.string().optional().describe('New body text (for iteration/refinement)'),
        status: z.enum(['draft', 'done']).optional().describe('New status (use "done" to mark as complete)'),
      }),
    }
  );
}
