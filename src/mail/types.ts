import { Post } from '../entities/post.entity';

export type TSendEmailData = {
  userEmails: string[],
  post: Post,
};
