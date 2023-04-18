import { Injectable } from '@nestjs/common';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostRepository } from './post.repository';
import { Post } from '../entities/post.entity';
import { User } from '../entities/user.entity';
import { QueueService } from '../queue/queue.service';
import { UserService } from '../user/user.service';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly queueService: QueueService,
    private readonly userService: UserService,
  ) {}

  async create(
    createPostDto: CreatePostDto,
    userId: string,
    file: Express.Multer.File,
  ): Promise<Post> {
    const post: Post = await this.postRepository.createPost(
      {
        ...createPostDto,
        userId,
      },
      file,
    );
    const users: User[] = await this.userService.findAll();
    await this.queueService.sendMailCreatePost(users, post);
    return post;
  }

  async findAll(userId: string): Promise<Post[]> {
    return this.postRepository.find({
      where: {
        userId,
      },
      order: {
        created: 'desc',
      },
      relations: {
        tags: true,
      },
    });
  }

  async findOne(id: string): Promise<Post> {
    return this.postRepository.findOne({
      where: { id },
      relations: { tags: true },
    });
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    await this.postRepository.update(id, updatePostDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.postRepository.removePost(id);
  }
}
