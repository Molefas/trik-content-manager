import { z } from 'zod';
import type { TrikStorage } from '../storage.js';
export declare function createCreateContent(storage: TrikStorage): import("@langchain/core/tools").DynamicStructuredTool<z.ZodObject<{
    type: z.ZodEnum<["article", "linkedin", "x_post"]>;
    title: z.ZodString;
    body: z.ZodString;
    inspirationIds: z.ZodArray<z.ZodString, "many">;
    userPrompt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "article" | "linkedin" | "x_post";
    title: string;
    body: string;
    inspirationIds: string[];
    userPrompt: string;
}, {
    type: "article" | "linkedin" | "x_post";
    title: string;
    body: string;
    inspirationIds: string[];
    userPrompt: string;
}>, {
    type: "article" | "linkedin" | "x_post";
    title: string;
    body: string;
    inspirationIds: string[];
    userPrompt: string;
}, {
    type: "article" | "linkedin" | "x_post";
    title: string;
    body: string;
    inspirationIds: string[];
    userPrompt: string;
}, string>;
export declare function createListContent(storage: TrikStorage): import("@langchain/core/tools").DynamicStructuredTool<z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["draft", "done"]>>;
    type: z.ZodOptional<z.ZodEnum<["article", "linkedin", "x_post"]>>;
}, "strip", z.ZodTypeAny, {
    type?: "article" | "linkedin" | "x_post" | undefined;
    status?: "draft" | "done" | undefined;
}, {
    type?: "article" | "linkedin" | "x_post" | undefined;
    status?: "draft" | "done" | undefined;
}>, {
    type?: "article" | "linkedin" | "x_post" | undefined;
    status?: "draft" | "done" | undefined;
}, {
    type?: "article" | "linkedin" | "x_post" | undefined;
    status?: "draft" | "done" | undefined;
}, string>;
export declare function createGetContent(storage: TrikStorage): import("@langchain/core/tools").DynamicStructuredTool<z.ZodObject<{
    contentId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    contentId: string;
}, {
    contentId: string;
}>, {
    contentId: string;
}, {
    contentId: string;
}, string>;
export declare function createUpdateContent(storage: TrikStorage): import("@langchain/core/tools").DynamicStructuredTool<z.ZodObject<{
    contentId: z.ZodString;
    body: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["draft", "done"]>>;
}, "strip", z.ZodTypeAny, {
    contentId: string;
    status?: "draft" | "done" | undefined;
    body?: string | undefined;
}, {
    contentId: string;
    status?: "draft" | "done" | undefined;
    body?: string | undefined;
}>, {
    contentId: string;
    status?: "draft" | "done" | undefined;
    body?: string | undefined;
}, {
    contentId: string;
    status?: "draft" | "done" | undefined;
    body?: string | undefined;
}, string>;
//# sourceMappingURL=content.d.ts.map