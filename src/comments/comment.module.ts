import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '@comments/entities/comment.entity';
import { Post } from '@posts/entities/post.entity';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Comment])],
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}
