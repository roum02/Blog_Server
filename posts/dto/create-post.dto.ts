export class CreatePostDto {
  title: string;
  content: string;
  category: string;
  authorId: number;
  isPublished?: boolean;
}
