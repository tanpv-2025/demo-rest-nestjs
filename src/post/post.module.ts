import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PostRepository } from './post.repository';
import { Post } from '../entities/post.entity';
import { QueueModule } from '../queue/queue.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    UserModule,
    QueueModule,
  ],
  controllers: [PostController],
  providers: [PostService, PostRepository],
})
export class PostModule {}
