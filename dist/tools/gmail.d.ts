import { z } from 'zod';
import type { TrikStorage } from '../storage.js';
export interface TrikConfig {
    get(key: string): string | undefined;
}
export declare function createFetchNewsletterEmails(storage: TrikStorage, config: TrikConfig): import("@langchain/core/tools").DynamicStructuredTool<z.ZodObject<{
    sourceId: z.ZodString;
    maxResults: z.ZodOptional<z.ZodNumber>;
    sinceDate: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    sourceId: string;
    maxResults?: number | undefined;
    sinceDate?: string | undefined;
}, {
    sourceId: string;
    maxResults?: number | undefined;
    sinceDate?: string | undefined;
}>, {
    sourceId: string;
    maxResults?: number | undefined;
    sinceDate?: string | undefined;
}, {
    sourceId: string;
    maxResults?: number | undefined;
    sinceDate?: string | undefined;
}, string>;
//# sourceMappingURL=gmail.d.ts.map