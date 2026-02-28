import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import type { TrikStorage } from '../storage.js';
import { addContentToStorage, getContentList, getContentById, updateContentInStorage, filterContent } from '../storage.js';

export function createCreateContent(storage: TrikStorage) {
  return tool(
    async (input) => {
      const content = await addContentToStorage(storage, {
        type: input.type,
        title: input.title,
        body: input.body,
        inspirationIds: input.inspirationIds,
        userPrompt: input.userPrompt,
      });
      return JSON.stringify({
        id: content.id,
        type: content.type,
        title: content.title,
        status: content.status,
        inspirationIds: content.inspirationIds,
        createdAt: content.createdAt,
      });
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
      const allContent = await getContentList(storage);
      const results = filterContent(allContent, {
        status: input.status,
        type: input.type,
      });

      const summaries = results.map((c) => ({
        id: c.id,
        type: c.type,
        title: c.title,
        status: c.status,
        inspirationIds: c.inspirationIds,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      }));

      return JSON.stringify({
        resultCount: summaries.length,
        content: summaries,
      });
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
      const content = await getContentById(storage, input.contentId);
      if (!content) {
        return JSON.stringify({ error: 'Content not found', contentId: input.contentId });
      }
      return JSON.stringify(content);
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
      const { content, action } = await updateContentInStorage(storage, input.contentId, {
        body: input.body,
        status: input.status,
      });
      if (!content) {
        return JSON.stringify({ error: 'Content not found', contentId: input.contentId });
      }
      return JSON.stringify({
        id: content.id,
        title: content.title,
        status: content.status,
        action,
        updatedAt: content.updatedAt,
      });
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
