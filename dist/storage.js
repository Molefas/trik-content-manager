import crypto from 'node:crypto';
function generateId() {
    return crypto.randomUUID();
}
// === Sources ===
export async function getSources(storage) {
    const data = await storage.get('sources');
    return data || [];
}
export async function addSourceToStorage(storage, source) {
    const sources = await getSources(storage);
    const existing = sources.find((s) => s.identifier === source.identifier && s.type === source.type);
    if (existing) {
        return { source: existing, status: 'duplicate' };
    }
    const newSource = {
        ...source,
        id: generateId(),
        addedAt: new Date().toISOString(),
        lastScannedAt: null,
    };
    sources.push(newSource);
    await storage.set('sources', sources);
    return { source: newSource, status: 'added' };
}
export async function removeSourceFromStorage(storage, sourceId) {
    const sources = await getSources(storage);
    const index = sources.findIndex((s) => s.id === sourceId);
    if (index === -1) {
        return { source: null, status: 'not_found' };
    }
    const [removed] = sources.splice(index, 1);
    await storage.set('sources', sources);
    return { source: removed, status: 'removed' };
}
export async function updateSourceScanTime(storage, sourceId) {
    const sources = await getSources(storage);
    const source = sources.find((s) => s.id === sourceId);
    if (source) {
        source.lastScannedAt = new Date().toISOString();
        await storage.set('sources', sources);
    }
}
// === Inspirations ===
export async function getInspirations(storage) {
    const data = await storage.get('inspirations');
    return data || [];
}
export async function addInspirationToStorage(storage, inspiration) {
    const inspirations = await getInspirations(storage);
    const existing = inspirations.find((i) => i.url === inspiration.url);
    if (existing) {
        return { inspiration: existing, status: 'duplicate' };
    }
    const newInspiration = {
        ...inspiration,
        id: generateId(),
        addedAt: new Date().toISOString(),
    };
    inspirations.push(newInspiration);
    await storage.set('inspirations', inspirations);
    return { inspiration: newInspiration, status: 'added' };
}
export async function getInspirationById(storage, id) {
    const inspirations = await getInspirations(storage);
    return inspirations.find((i) => i.id === id) || null;
}
export function filterInspirations(inspirations, filters) {
    let results = [...inspirations];
    if (filters.query) {
        const q = filters.query.toLowerCase();
        results = results.filter((i) => i.title.toLowerCase().includes(q) ||
            i.description.toLowerCase().includes(q));
    }
    if (filters.minScore !== undefined) {
        results = results.filter((i) => i.score >= filters.minScore);
    }
    if (filters.maxScore !== undefined) {
        results = results.filter((i) => i.score <= filters.maxScore);
    }
    if (filters.dateFrom) {
        results = results.filter((i) => i.addedAt >= filters.dateFrom);
    }
    if (filters.dateTo) {
        results = results.filter((i) => i.addedAt <= filters.dateTo);
    }
    if (filters.sourceId) {
        results = results.filter((i) => i.sourceId === filters.sourceId);
    }
    if (filters.sortBy === 'score') {
        results.sort((a, b) => b.score - a.score);
    }
    else {
        results.sort((a, b) => b.addedAt.localeCompare(a.addedAt));
    }
    if (filters.limit) {
        results = results.slice(0, filters.limit);
    }
    return results;
}
// === Content ===
export async function getContentList(storage) {
    const data = await storage.get('content');
    return data || [];
}
export async function addContentToStorage(storage, content) {
    const contentList = await getContentList(storage);
    const now = new Date().toISOString();
    const newContent = {
        ...content,
        id: generateId(),
        status: 'draft',
        createdAt: now,
        updatedAt: now,
    };
    contentList.push(newContent);
    await storage.set('content', contentList);
    return newContent;
}
export async function getContentById(storage, id) {
    const contentList = await getContentList(storage);
    return contentList.find((c) => c.id === id) || null;
}
export async function updateContentInStorage(storage, id, updates) {
    const contentList = await getContentList(storage);
    const content = contentList.find((c) => c.id === id);
    if (!content) {
        return { content: null, action: 'not_found' };
    }
    let action;
    const hasBody = updates.body !== undefined;
    const hasStatus = updates.status !== undefined;
    if (hasBody && hasStatus)
        action = 'both';
    else if (hasBody)
        action = 'body_updated';
    else
        action = 'status_changed';
    if (hasBody)
        content.body = updates.body;
    if (hasStatus)
        content.status = updates.status;
    content.updatedAt = new Date().toISOString();
    await storage.set('content', contentList);
    return { content, action };
}
export function filterContent(contentList, filters) {
    let results = [...contentList];
    if (filters.status) {
        results = results.filter((c) => c.status === filters.status);
    }
    if (filters.type) {
        results = results.filter((c) => c.type === filters.type);
    }
    return results.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
//# sourceMappingURL=storage.js.map