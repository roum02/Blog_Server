import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Post } from '@posts/entities/post.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

// controller에 의존성 주입을 위한 데코레이터
@Injectable()
export class CommentService {
  // Entity에 대한 TypeOrm의 객체 만들기 -> DB 접근 CRUD 위함
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const post = await this.postRepository.findOne({
      where: { id: createCommentDto.postId },
    });

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    const newComment = this.commentRepository.create({
      ...createCommentDto,
      post, // 관계 주입
    });

    return await this.commentRepository.save(newComment);
  }

  /** 댓글 전체 조회 (특정 postId에 해당하는) */
  async findByPostId(postId: number): Promise<Comment[]> {
    return await this.commentRepository.find({
      where: { post: { id: postId } },
      order: { id: 'DESC' },
    });
  }

  /** 댓글 수정 */
  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const comment = await this.commentRepository.findOne({ where: { id } });

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    Object.assign(comment, updateCommentDto);
    return await this.commentRepository.save(comment);
  }

  /** 댓글 삭제 */
  async remove(id: number): Promise<void> {
    const result = await this.commentRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }
  }
}
