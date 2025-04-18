import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentService } from './comment.service';

@ApiTags('Comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @ApiOperation({ summary: '댓글 생성' })
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  }

  @Get()
  @ApiOperation({ summary: '게시글에 해당하는 댓글 목록 조회' })
  @ApiQuery({
    name: 'postId',
    type: Number,
    description: '게시글 ID',
    required: true,
  })
  findByPostId(@Query('postId', ParseIntPipe) postId: number) {
    return this.commentService.findByPostId(postId);
  }

  @Patch(':id')
  @ApiOperation({ summary: '댓글 수정' })
  @ApiParam({ name: 'id', type: Number, description: '댓글 ID' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.update(id, updateCommentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '댓글 삭제' })
  @ApiParam({ name: 'id', type: Number, description: '댓글 ID' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.remove(id);
  }
}
