import { Faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';

import { Post } from '../../entities/post.entity';

export default setSeederFactory(Post, async (faker: Faker) => {
  const post = new Post();
  post.title = faker.lorem.words(3);
  post.description = faker.lorem.words(10);
  post.filePath = faker.random.alpha(10);
  return post;
});
