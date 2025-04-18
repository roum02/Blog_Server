import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto {
  @ApiProperty({ example: '수정된 댓글 내용', description: '댓글 내용' })
  content?: string;

  @ApiProperty({ example: false, description: '공개 여부', required: false })
  isPublished?: boolean;
}
