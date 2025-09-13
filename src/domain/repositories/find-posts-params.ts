export interface FindPostsParams {
    search?: string;
    tag?: string;
    authorId?: string;
    authorName?: string;
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'title';
    sortOrder?: 'asc' | 'desc';
}