import {
  Controller,
  Get,
  Post as HttpPost,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @HttpPost()
  @ApiOperation({
    summary: '게시글 생성',
    description: '새로운 게시글을 작성합니다.',
  })
  @ApiBody({ type: CreatePostDto })
  @ApiResponse({ status: 201, description: '게시글 생성 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청입니다.' })
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Get()
  @ApiOperation({
    summary: '모든 게시글 조회',
    description: '전체 게시글 목록을 조회합니다.',
  })
  @ApiResponse({ status: 200, description: '게시글 목록 반환' })
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: '특정 게시글 조회',
    description: 'ID를 기반으로 특정 게시글을 조회합니다.',
  })
  @ApiParam({ name: 'id', description: '게시글 ID' })
  @ApiResponse({ status: 200, description: '게시글 조회 성공' })
  @ApiResponse({ status: 404, description: '게시글을 찾을 수 없습니다.' })
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: '게시글 수정',
    description: 'ID를 기반으로 게시글을 수정합니다.',
  })
  @ApiParam({ name: 'id', description: '게시글 ID' })
  @ApiBody({ type: UpdatePostDto })
  @ApiResponse({ status: 200, description: '게시글 수정 성공' })
  @ApiResponse({ status: 404, description: '게시글을 찾을 수 없습니다.' })
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '게시글 삭제',
    description: 'ID를 기반으로 게시글을 삭제합니다.',
  })
  @ApiParam({ name: 'id', description: '게시글 ID' })
  @ApiResponse({ status: 200, description: '게시글 삭제 성공' })
  @ApiResponse({ status: 404, description: '게시글을 찾을 수 없습니다.' })
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
