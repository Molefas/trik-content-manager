import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import type { TrikStorage } from '../storage.js';
import { addSourceToStorage, getSources, removeSourceFromStorage } from '../storage.js';

export function createAddSource(storage: TrikStorage) {
  return tool(
    async (input) => {
      const { source, status } = await addSourceToStorage(storage, {
        type: input.type,
        identifier: input.identifier,
        title: input.title,
      });
      return JSON.stringify({
        id: source.id,
        type: source.type,
        identifier: source.identifier,
        title: source.title,
        status,
        addedAt: source.addedAt,
      });
    },
    {
      name: 'addSource',
      description:
        'Add a new content source (blog URL, single article URL, or newsletter sender email) to the tracked sources list.',
      schema: z.object({
        type: z.enum(['blog', 'article', 'newsletter']).describe('Type of source'),
        identifier: z.string().max(500).describe('URL for blog/article, or sender email for newsletter'),
        title: z.string().max(200).describe('Human-readable name for this source'),
      }),
    }
  );
}

export function createListSources(storage: TrikStorage) {
  return tool(
    async (input) => {
      let sources = await getSources(storage);
      const filterType = input.type || 'all';

      if (input.type) {
        sources = sources.filter((s) => s.type === input.type);
      }

      const summaries = sources.map((s) => ({
        id: s.id,
        type: s.type,
        identifier: s.identifier,
        title: s.title,
        addedAt: s.addedAt,
        lastScannedAt: s.lastScannedAt,
      }));

      return JSON.stringify({
        filterType,
        resultCount: summaries.length,
        sources: summaries,
      });
    },
    {
      name: 'listSources',
      description: 'List all tracked content sources with optional type filter.',
      schema: z.object({
        type: z
          .enum(['blog', 'article', 'newsletter'])
          .optional()
          .describe('Filter by source type. Omit to list all.'),
      }),
    }
  );
}

export function createRemoveSource(storage: TrikStorage) {
  return tool(
    async (input) => {
      const { source, status } = await removeSourceFromStorage(storage, input.sourceId);
      return JSON.stringify({
        sourceId: input.sourceId,
        title: source?.title || 'unknown',
        status,
      });
    },
    {
      name: 'removeSource',
      description: 'Remove a tracked content source by ID.',
      schema: z.object({
        sourceId: z.string().describe('ID of the source to remove'),
      }),
    }
  );
}
