export interface PostOutputDTO {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author?: string;
  tags: string[];
  videoUrl?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostAuthorDTO {
  id: string;
  name: string;
  totalPosts: number;
}

export interface PaginatedPostsOutputDTO {
  data: PostOutputDTO[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
