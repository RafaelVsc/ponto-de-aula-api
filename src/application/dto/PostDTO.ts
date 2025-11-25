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
