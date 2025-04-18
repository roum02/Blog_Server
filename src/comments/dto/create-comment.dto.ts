import { ApiProperty } from '@nestjs/swagger';

// Data Transfer Object -> 데이터 구조를 정의한 클래스
export class CreateCommentDto {
  @ApiProperty({ example: 1, description: '댓글이 달릴 게시글 ID' })
  postId: number;

  @ApiProperty({ example: 2, description: '댓글 작성자 ID' })
  authorId: number;

  @ApiProperty({ example: '정말 좋은 글이에요!', description: '댓글 내용' })
  content: string;

  @ApiProperty({
    example: true,
    required: false,
    description: '댓글 공개 여부 (기본값: true)',
  })
  isPublished?: boolean;
}
