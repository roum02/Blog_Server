import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../config/typeorm.config';
import { PostModule } from '@posts/post.module';
import { CategoryModule } from '@category/category.module';
import { CommentModule } from '@comments/comment.module';
import { AuthModule } from '@auth/auth.module';
import { UserModule } from '@user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    PostModule,
    CategoryModule,
    CommentModule,
    AuthModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
