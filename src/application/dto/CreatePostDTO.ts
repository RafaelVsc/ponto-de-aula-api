export interface CreatePostInputDTO {
    title: string;
    content: string;
    authorId: string;
    videoUrl?: string;
    imageUrl?: string;
    tags?: string[];
}

export interface CreatePostOutputDTO {
    id: string;
}