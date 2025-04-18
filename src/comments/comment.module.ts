import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '@comments/entities/comment.entity';
import { Post } from '@posts/entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Comment])],
})
export class CommentModule {}
