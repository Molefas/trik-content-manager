import { z } from 'zod';
import type { TrikStorage } from '../storage.js';
export declare function createAddInspiration(storage: TrikStorage): import("@langchain/core/tools").DynamicStructuredTool<z.ZodObject<{
    sourceId: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    url: z.ZodString;
    score: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    title: string;
    sourceId: string;
    description: string;
    url: string;
    score: number;
}, {
    title: string;
    sourceId: string;
    description: string;
    url: string;
    score: number;
}>, {
    title: string;
    sourceId: string;
    description: string;
    url: string;
    score: number;
}, {
    title: string;
    sourceId: string;
    description: string;
    url: string;
    score: number;
}, string>;
export declare function createListInspirations(storage: TrikStorage): import("@langchain/core/tools").DynamicStructuredTool<z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    minScore: z.ZodOptional<z.ZodNumber>;
    maxScore: z.ZodOptional<z.ZodNumber>;
    dateFrom: z.ZodOptional<z.ZodString>;
    dateTo: z.ZodOptional<z.ZodString>;
    sourceId: z.ZodOptional<z.ZodString>;
    sortBy: z.ZodOptional<z.ZodEnum<["score", "date"]>>;
    limit: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    sourceId?: string | undefined;
    query?: string | undefined;
    minScore?: number | undefined;
    maxScore?: number | undefined;
    dateFrom?: string | undefined;
    dateTo?: string | undefined;
    sortBy?: "score" | "date" | undefined;
    limit?: number | undefined;
}, {
    sourceId?: string | undefined;
    query?: string | undefined;
    minScore?: number | undefined;
    maxScore?: number | undefined;
    dateFrom?: string | undefined;
    dateTo?: string | undefined;
    sortBy?: "score" | "date" | undefined;
    limit?: number | undefined;
}>, {
    sourceId?: string | undefined;
    query?: string | undefined;
    minScore?: number | undefined;
    maxScore?: number | undefined;
    dateFrom?: string | undefined;
    dateTo?: string | undefined;
    sortBy?: "score" | "date" | undefined;
    limit?: number | undefined;
}, {
    sourceId?: string | undefined;
    query?: string | undefined;
    minScore?: number | undefined;
    maxScore?: number | undefined;
    dateFrom?: string | undefined;
    dateTo?: string | undefined;
    sortBy?: "score" | "date" | undefined;
    limit?: number | undefined;
}, string>;
export declare function createGetInspiration(storage: TrikStorage): import("@langchain/core/tools").DynamicStructuredTool<z.ZodObject<{
    inspirationId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    inspirationId: string;
}, {
    inspirationId: string;
}>, {
    inspirationId: string;
}, {
    inspirationId: string;
}, string>;
//# sourceMappingURL=inspirations.d.ts.map