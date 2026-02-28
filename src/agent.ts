import { ChatAnthropic } from '@langchain/anthropic';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { wrapAgent, transferBackTool } from '@trikhub/sdk';
import type { TrikContext } from '@trikhub/sdk';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { createAddSource, createListSources, createRemoveSource } from './tools/sources.js';
import { createAddInspiration, createListInspirations, createGetInspiration } from './tools/inspirations.js';
import { createCreateContent, createListContent, createGetContent, createUpdateContent } from './tools/content.js';
import { createFetchNewsletterEmails } from './tools/gmail.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const systemPrompt = readFileSync(join(__dirname, 'prompts/system.md'), 'utf-8');

export default wrapAgent((context: TrikContext) => {
  const { storage, config } = context;

  const model = new ChatAnthropic({
    modelName: 'claude-sonnet-4-6',
    anthropicApiKey: config.get('ANTHROPIC_API_KEY'),
  });

  const tools = [
    // Sources
    createAddSource(storage),
    createListSources(storage),
    createRemoveSource(storage),
    // Inspirations
    createAddInspiration(storage),
    createListInspirations(storage),
    createGetInspiration(storage),
    // Gmail
    createFetchNewsletterEmails(storage, config),
    // Content
    createCreateContent(storage),
    createListContent(storage),
    createGetContent(storage),
    createUpdateContent(storage),
    // Transfer back
    transferBackTool,
  ];

  return createReactAgent({
    llm: model,
    tools,
    messageModifier: systemPrompt,
  });
});
