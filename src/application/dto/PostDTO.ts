export interface PostOutputDTO {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
