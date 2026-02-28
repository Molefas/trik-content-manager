export interface Source {
  id: string;
  type: 'blog' | 'article' | 'newsletter';
  identifier: string;
  title: string;
  addedAt: string;
  lastScannedAt: string | null;
}

export interface Inspiration {
  id: string;
  sourceId: string;
  title: string;
  description: string;
  url: string;
  score: number;
  addedAt: string;
}

export interface Content {
  id: string;
  type: 'article' | 'linkedin' | 'x_post';
  title: string;
  body: string;
  status: 'draft' | 'done';
  inspirationIds: string[];
  userPrompt: string;
  createdAt: string;
  updatedAt: string;
}

export type SourceType = Source['type'];
export type ContentType = Content['type'];
export type ContentStatus = Content['status'];
