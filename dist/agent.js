import { ChatAnthropic } from '@langchain/anthropic';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { wrapAgent, transferBackTool } from '@trikhub/sdk';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createAddSource, createListSources, createRemoveSource } from './tools/sources.js';
import { createAddInspiration, createListInspirations, createGetInspiration } from './tools/inspirations.js';
import { createCreateContent, createListContent, createGetContent, createUpdateContent } from './tools/content.js';
import { createFetchNewsletterEmails } from './tools/gmail.js';
const __dirname = dirname(fileURLToPath(import.meta.url));
const baseSystemPrompt = readFileSync(join(__dirname, 'prompts/system.md'), 'utf-8');
export default wrapAgent(async (context) => {
    const { storage, config } = context;
    // Build dynamic system prompt with voice and interests from storage
    const voice = (await storage.get('voice')) || '';
    const interests = (await storage.get('interests')) || '';
    let systemPrompt = baseSystemPrompt;
    if (voice) {
        systemPrompt += `\n\n## User's Voice Profile\n\n${voice}`;
    }
    if (interests) {
        systemPrompt += `\n\n## User's Interests\n\n${interests}`;
    }
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
//# sourceMappingURL=agent.js.map