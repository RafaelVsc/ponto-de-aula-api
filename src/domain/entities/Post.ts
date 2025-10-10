export interface Post {
  id?: string;
  title: string;
  content: string;
  authorId: string;
  author?: string;
  videoUrl?: string;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
  tags?: string[];
}
