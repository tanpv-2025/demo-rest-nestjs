import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

import { QueueConStant } from './queue.constant';
import { User } from '../entities/user.entity';
import { Post } from '../entities/post.entity';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue(QueueConStant.names.sendEmail) private readonly sendEmailQueue: Queue,
  ) {}

  async sendMailCreatePost(users: User[], post: Post): Promise<void> {
    const userEmails: string[] = users.map((user) => user.email);
    await this.sendEmailQueue.add(
      QueueConStant.names.sendEmail,
      { userEmails, post },
      QueueConStant.jobOptions,
    );
  }
}
