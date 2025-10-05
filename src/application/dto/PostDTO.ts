export interface PostOutputDTO {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}