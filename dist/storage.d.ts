import type { Source, Inspiration, Content } from './types.js';
export interface TrikStorage {
    get(key: string): Promise<unknown>;
    set(key: string, value: unknown): Promise<void>;
}
export declare function getSources(storage: TrikStorage): Promise<Source[]>;
export declare function addSourceToStorage(storage: TrikStorage, source: Omit<Source, 'id' | 'addedAt' | 'lastScannedAt'>): Promise<{
    source: Source;
    status: 'added' | 'duplicate';
}>;
export declare function removeSourceFromStorage(storage: TrikStorage, sourceId: string): Promise<{
    source: Source | null;
    status: 'removed' | 'not_found';
}>;
export declare function updateSourceScanTime(storage: TrikStorage, sourceId: string): Promise<void>;
export declare function getInspirations(storage: TrikStorage): Promise<Inspiration[]>;
export declare function addInspirationToStorage(storage: TrikStorage, inspiration: Omit<Inspiration, 'id' | 'addedAt'>): Promise<{
    inspiration: Inspiration;
    status: 'added' | 'duplicate';
}>;
export declare function getInspirationById(storage: TrikStorage, id: string): Promise<Inspiration | null>;
export interface InspirationFilters {
    query?: string;
    minScore?: number;
    maxScore?: number;
    dateFrom?: string;
    dateTo?: string;
    sourceId?: string;
    sortBy?: 'score' | 'date';
    limit?: number;
}
export declare function filterInspirations(inspirations: Inspiration[], filters: InspirationFilters): Inspiration[];
export declare function getContentList(storage: TrikStorage): Promise<Content[]>;
export declare function addContentToStorage(storage: TrikStorage, content: Omit<Content, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Content>;
export declare function getContentById(storage: TrikStorage, id: string): Promise<Content | null>;
export declare function updateContentInStorage(storage: TrikStorage, id: string, updates: {
    body?: string;
    status?: 'draft' | 'done';
}): Promise<{
    content: Content | null;
    action: 'body_updated' | 'status_changed' | 'both' | 'not_found';
}>;
export interface ContentFilters {
    status?: 'draft' | 'done';
    type?: 'article' | 'linkedin' | 'x_post';
}
export declare function filterContent(contentList: Content[], filters: ContentFilters): Content[];
//# sourceMappingURL=storage.d.ts.map