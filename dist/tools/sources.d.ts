import { z } from 'zod';
import type { TrikStorage } from '../storage.js';
export declare function createAddSource(storage: TrikStorage): import("@langchain/core/tools").DynamicStructuredTool<z.ZodObject<{
    type: z.ZodEnum<["blog", "article", "newsletter"]>;
    identifier: z.ZodString;
    title: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "blog" | "article" | "newsletter";
    identifier: string;
    title: string;
}, {
    type: "blog" | "article" | "newsletter";
    identifier: string;
    title: string;
}>, {
    type: "blog" | "article" | "newsletter";
    identifier: string;
    title: string;
}, {
    type: "blog" | "article" | "newsletter";
    identifier: string;
    title: string;
}, string>;
export declare function createListSources(storage: TrikStorage): import("@langchain/core/tools").DynamicStructuredTool<z.ZodObject<{
    type: z.ZodOptional<z.ZodEnum<["blog", "article", "newsletter"]>>;
}, "strip", z.ZodTypeAny, {
    type?: "blog" | "article" | "newsletter" | undefined;
}, {
    type?: "blog" | "article" | "newsletter" | undefined;
}>, {
    type?: "blog" | "article" | "newsletter" | undefined;
}, {
    type?: "blog" | "article" | "newsletter" | undefined;
}, string>;
export declare function createRemoveSource(storage: TrikStorage): import("@langchain/core/tools").DynamicStructuredTool<z.ZodObject<{
    sourceId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    sourceId: string;
}, {
    sourceId: string;
}>, {
    sourceId: string;
}, {
    sourceId: string;
}, string>;
//# sourceMappingURL=sources.d.ts.map