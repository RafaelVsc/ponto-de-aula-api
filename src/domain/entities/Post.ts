export interface Post {
  id?: string;
  title: string;
  content: string;
  authorId: string;
  videoUrl?: string;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
  tags?: string[];
}
