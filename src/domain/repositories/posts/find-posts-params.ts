export interface FindPostsParams {
  search?: string;
  title?: string;
  tag?: string;
  authorId?: string;
  authorName?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}
