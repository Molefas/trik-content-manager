# Content Manager Trik - Design Document

**Date:** 2026-02-28
**Status:** Approved
**Mode:** Conversational (LLM Agent)
**Language:** TypeScript

---

## Goal

Automate content gathering and generation:
- Populate a blog with articles inspired by other writers
- Automatically create X and LinkedIn posts from interesting news
- All driven conversationally - no IDs, no commands, just natural language

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Trik mode | Conversational | Multi-turn interaction, iteration, contextual understanding |
| Gmail access | OAuth2 (Gmail API) | Full search, reliable, structured access |
| Blog scanning | HTML scraping (agent-driven) | Universal, agent can parse any layout |
| Web fetching | Agent handles it | Tools are data-only, agent has web capabilities |
| Inspiration scoring | LLM at add-time | Uses interests.md context, nuanced judgment |
| Tool architecture | Workflow-aligned (~11 tools) | Maps to user intents, good LLM agent balance |

---

## Data Model

### Source
```typescript
interface Source {
  id: string;                    // UUID
  type: 'blog' | 'article' | 'newsletter';
  identifier: string;           // URL (blog/article) or sender email (newsletter)
  title: string;                // Human-readable name
  addedAt: string;              // ISO date
  lastScannedAt: string | null; // When last checked for new content
}
```

### Inspiration
```typescript
interface Inspiration {
  id: string;                   // UUID
  sourceId: string;             // FK to Source
  title: string;
  description: string;          // Brief summary
  url: string;                  // Link to original content
  score: number;                // 1-10, LLM-scored against user interests
  addedAt: string;              // ISO date
}
```

### Content
```typescript
interface Content {
  id: string;                   // UUID
  type: 'article' | 'linkedin' | 'x_post';
  title: string;
  body: string;                 // The generated content
  status: 'draft' | 'done';
  inspirationIds: string[];     // Which inspirations it was based on
  userPrompt: string;           // The original user request/context
  createdAt: string;            // ISO date
  updatedAt: string;            // ISO date
}
```

---

## Tools (11)

### Sources Management (3)

#### addSource
- **Purpose:** Add a new blog URL, single article URL, or newsletter sender email
- **Input:** type (blog|article|newsletter), identifier (URL/email), title
- **Output:** source ID, status (added|duplicate|updated)
- **Log:** `Add source: {{sourceType}}, {{identifier}}, {{title}}, {{status}}`

#### listSources
- **Purpose:** List all tracked sources with optional type filter
- **Input:** type filter (optional)
- **Output:** Array of sources with summary info
- **Log:** `List sources: {{filterType}}, {{resultCount}}`

#### removeSource
- **Purpose:** Remove a source and optionally its inspirations
- **Input:** source ID
- **Output:** Removal confirmation
- **Log:** `Remove source: {{sourceId}}, {{title}}, {{status}}`

### Inspiration Management (3)

#### addInspiration
- **Purpose:** Store a new inspiration entry with LLM-scored relevance
- **Input:** sourceId, title, description, url, score (1-10)
- **Output:** Inspiration ID, confirmation
- **Log:** `Add inspiration: {{title}}, {{score}}, {{sourceTitle}}, {{status}}`

#### listInspirations
- **Purpose:** Search and filter inspirations by multiple criteria
- **Input:** query (optional), minScore/maxScore (optional), dateFrom/dateTo (optional), sourceId (optional), limit (optional), sortBy (optional: score|date)
- **Output:** Array of matching inspirations
- **Log:** `List inspirations: {{filterType}}, {{resultCount}}`

#### getInspiration
- **Purpose:** Get full details of a specific inspiration
- **Input:** inspiration ID
- **Output:** Full inspiration object
- **Log:** `Get inspiration: {{title}}, {{score}}`

### Gmail Integration (1)

#### fetchNewsletterEmails
- **Purpose:** Fetch recent emails from a newsletter sender via Gmail API
- **Input:** sourceId (newsletter source), maxResults (optional), sinceDate (optional)
- **Output:** Array of email summaries with subjects, links extracted, dates
- **Log:** `Fetch newsletter: {{senderEmail}}, {{emailCount}}, {{status}}`
- **Note:** Uses OAuth2 credentials from trik config

### Content Management (4)

#### createContent
- **Purpose:** Store a newly generated piece of content as draft
- **Input:** type (article|linkedin|x_post), title, body, inspirationIds, userPrompt
- **Output:** Content ID, confirmation
- **Log:** `Create content: {{contentType}}, {{title}}, {{inspirationCount}}, {{status}}`

#### listContent
- **Purpose:** List content filtered by status and/or type
- **Input:** status filter (optional: draft|done), type filter (optional)
- **Output:** Array of content summaries
- **Log:** `List content: {{statusFilter}}, {{typeFilter}}, {{resultCount}}`

#### getContent
- **Purpose:** Get full content details including body
- **Input:** content ID
- **Output:** Full content object
- **Log:** `Get content: {{title}}, {{contentType}}, {{status}}`

#### updateContent
- **Purpose:** Update content body (iteration) or status (draft -> done)
- **Input:** content ID, body (optional), status (optional)
- **Output:** Updated content confirmation
- **Log:** `Update content: {{title}}, {{action}}, {{status}}`

---

## Agent Behavior

### System Prompt Core Principles
1. **Conversational first** - Never ask for IDs, find items by name/description
2. **Voice-aware** - Read voice.md before generating any content
3. **Interest-aware** - Read interests.md when scoring inspirations
4. **Proactive suggestions** - When creating content, suggest relevant inspirations

### Key Workflows

#### Blog Scanning
1. `listSources(type: blog)` -> get all blog sources
2. Agent fetches each blog URL (web capability)
3. Agent parses HTML for article links
4. `listInspirations(sourceId)` -> check what's already stored
5. For new articles: agent reads interests.md, scores relevance, calls `addInspiration`
6. Reports summary to user

#### Newsletter Scanning
1. `listSources(type: newsletter)` -> get newsletter senders
2. `fetchNewsletterEmails(sourceId)` -> Gmail API returns email content
3. Agent extracts article links from email HTML/text
4. Scores and adds new inspirations (same as blog flow)

#### Content Creation
1. User requests content (e.g., "make me a LI post about AI trends")
2. Agent calls `listInspirations` to find relevant sources
3. Agent fetches actual article URLs for selected inspirations (lazy scraping)
4. Agent reads voice.md for the appropriate content type style
5. Agent generates content using inspirations + voice + user prompt
6. Calls `createContent` to store as draft
7. Presents to user for iteration
8. User feedback -> agent refines -> `updateContent` with new body
9. User approves -> `updateContent(status: done)`

#### Trend Analysis
1. `listInspirations` with date range
2. Agent semantically analyzes titles/descriptions
3. Presents theme clusters and patterns

---

## Config

| Key | Purpose | Required |
|-----|---------|----------|
| `gmail_client_id` | Google OAuth2 client ID | For newsletter support |
| `gmail_client_secret` | Google OAuth2 client secret | For newsletter support |
| `gmail_refresh_token` | OAuth2 refresh token | For newsletter support |

## Storage

Built-in trik storage (key-value):
- `sources` -> JSON array of Source objects
- `inspirations` -> JSON array of Inspiration objects
- `content` -> JSON array of Content objects
- `voice` -> Contents of voice.md (user's writing style per content type)
- `interests` -> Contents of interests.md (user's interest areas)

## File Structure

```
trik-content-manager/
├── manifest.json              # Trik manifest (tools, config, capabilities)
├── src/
│   ├── index.ts               # Main handler: agent prompt + tool dispatch
│   ├── types.ts               # TypeScript interfaces
│   ├── storage.ts             # Storage helpers (CRUD operations)
│   ├── tools/
│   │   ├── sources.ts         # addSource, listSources, removeSource
│   │   ├── inspirations.ts    # addInspiration, listInspirations, getInspiration
│   │   ├── content.ts         # createContent, listContent, getContent, updateContent
│   │   └── gmail.ts           # fetchNewsletterEmails (Gmail API)
│   └── prompts/
│       └── system.ts          # Agent system prompt builder
├── voice.md                   # Template voice profile
├── interests.md               # Template interests file
├── package.json
├── tsconfig.json
└── docs/
    └── plans/
```

---

## Classic Prompts (How the agent handles them)

| User Prompt | Agent Flow |
|-------------|------------|
| "Find me articles on AI" | `listInspirations(query: "AI")` -> present results |
| "Grab article X and Y, merge into one post" | `listInspirations` -> find X and Y -> fetch URLs -> generate with voice -> `createContent` |
| "Check for new articles/newsletters" | `listSources` -> scan blogs (fetch) + `fetchNewsletterEmails` -> `addInspiration` for new |
| "Top 10 articles of the last month" | `listInspirations(dateFrom: 30d ago, sortBy: score, limit: 10)` |
| "Any trends in the last 2 months?" | `listInspirations(dateFrom: 60d ago)` -> semantic analysis |
| "Make a LI post based on article Z" | Find Z -> fetch URL -> read voice (linkedin) -> generate -> `createContent(type: linkedin)` |
| "Take this link and turn into X post" | `addSource(type: article)` + `addInspiration` -> fetch -> `createContent(type: x_post)` |
| "What are the 8-9 ranked inspirations?" | `listInspirations(minScore: 8, maxScore: 9)` |
| "Any 10-rank inspirations this week?" | `listInspirations(minScore: 10, dateFrom: 7d ago)` |

---

## Out of Scope (Explicit)
- No CRON/scheduling - all on-demand via conversation
- No content posting/publishing - only gathering, creating, iterating, and marking done
- No automatic voice generation - voice.md is manually written
