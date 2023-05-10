import { HttpStatus, INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { setDataSource } from 'typeorm-extension';

import {
  create,
  getJWTResponse,
  initApp,
  initDataSource,
  mockJwtVerified,
  getJWTResponseWithFile,
  createMany,
} from '../helper';
import { User } from '../../src/entities/user.entity';
import { Post } from '../../src/entities/post.entity';
import { Tag } from '../../src/entities/tag.entity';
import { hash } from '../../src/shared/ultils/bcypt.util';

describe('Post controller', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let server: any;
  let user: User;
  let posts: Partial<Post>[];

  beforeAll(async () => {
    app = await initApp();
    server = app.getHttpServer();
    dataSource = await initDataSource();
    setDataSource(dataSource);
    user = await create<User>(User, {
      password: await hash('123456'),
    });
    posts = (await createMany(Post, 3, { userId: user.id }))
      .reverse()
      .map(({ created, updated, ...otherInfo }: Post) => otherInfo);
  });

  afterAll(async () => {
    server.close();
    jest.clearAllMocks();

    await dataSource.getRepository(Post).delete({});
    await dataSource.getRepository(User).delete({});
    await app.close();
  });

  describe('findAll', () => {
    const route = 'posts';
    let mock = null;

    describe('Error', () => {
      it('Should return error when wrong token', async () => {
        const [status, res] = await getJWTResponse(app, 'get', route);

        expect(res.message).toEqual('Unauthorized');
        expect(status).toEqual(HttpStatus.UNAUTHORIZED);
      });
    });

    describe('Success', () => {
      beforeEach(() => {
        mock = mockJwtVerified(user);
      });

      afterEach(() => {
        mock.mockRestore();
      });

      it('Should find all success', async () => {
        const [status, res] = await getJWTResponse(app, 'get', route);

        expect(res.length).toEqual(posts.length);
        expect(res).toMatchObject(posts);
        expect(status).toEqual(HttpStatus.OK);
      });
    });
  });

  describe('findOne', () => {
    let mock = null;
    let post: Post;
    let route: string;

    beforeAll(async () => {
      post = await create(Post, { userId: user.id });
      await create(Tag, {
        postId: post.id,
      });
      route = `posts/${post.id}`;
    });

    afterAll(async () => {
      await dataSource.getRepository(Tag).delete({});
      await dataSource.getRepository(Post).delete(post.id);
    });

    describe('Error', () => {
      it('Should return error when wrong token', async () => {
        const [status, res] = await getJWTResponse(app, 'get', route);

        expect(res.message).toEqual('Unauthorized');
        expect(status).toEqual(HttpStatus.UNAUTHORIZED);
      });
    });

    describe('success', () => {
      beforeAll(() => {
        mock = mockJwtVerified(user);
      });

      afterAll(() => {
        mock.mockRestore();
      });

      it('Should find one failed if params invalid', async () => {
        const [status, res] = await getJWTResponse(app, 'get', 'posts/invalid-id');

        expect(res.errors).toEqual([]);
        expect(res.messages).toEqual('リクエストパラメータが正しくない。');
        expect(status).toEqual(HttpStatus.BAD_REQUEST);
      });

      it('Should find one success if params valid', async () => {
        const [status, res] = await getJWTResponse(app, 'get', route);

        expect(res.id).toEqual(post.id);
        expect(res.title).toEqual(post.title);
        expect(res.description).toEqual(post.description);
        expect(res.filePath).toEqual(post.filePath);
        expect(res.tags.length).toEqual(1);
        expect(status).toEqual(HttpStatus.OK);
      });
    });
  });

  describe('create', () => {
    let mock = null;
    const route = 'posts';

    describe('Error', () => {
      it('Should return error when wrong token', async () => {
        const [status, res] = await getJWTResponse(app, 'post', route);

        expect(res.message).toEqual('Unauthorized');
        expect(status).toEqual(HttpStatus.UNAUTHORIZED);
      });
    });

    describe('success', () => {
      beforeAll(() => {
        mock = mockJwtVerified(user);
      });

      afterAll(() => {
        mock.mockRestore();
      });

      it.each([
        [
          {
            title: '',
            description: 'description',
          },
        ],
        [
          {
            title: 't'.repeat(256),
            description: 'description',
          },
        ],
        [
          {
            title: 'title',
            description: 'd'.repeat(2001),
          },
        ],
        [
          {
            title: 'title',
            description: 'description',
            tags: 'tags',
          },
        ],
        [
          {
            title: 'title',
            description: 'description',
            tags: ['tags'],
          },
        ],
        [
          {
            title: 'title',
            description: 'description',
            tags: [{ name: '' }],
          },
        ],
      ])('Should create failed if data invalid %#', async (data) => {
        const [status, res] = await getJWTResponse(app, 'post', route, data);

        expect(res.messages).toEqual('リクエストパラメータが正しくない。');
        expect(status).toEqual(HttpStatus.BAD_REQUEST);
      });

      it.each([
        [
          {
            buffer: Buffer.from('a'.repeat(200001)),
            options: {
              filename: 'test.jpeg',
              contentType: 'image/jpeg',
            },
          },
          'Validation failed (expected size is less than 200000)',
        ],
        [
          {
            buffer: Buffer.from('a'),
            options: {
              filename: 'test.csv',
              contentType: 'text/csv',
            },
          },
          'Validation failed (expected type is image/jpeg)',
        ],
      ])('Should create failed if file invalid %#', async (fileObject, errMessage) => {
        const data = {
          title: 'title',
          description: 'description',
        };
        const [status, res] = await getJWTResponseWithFile(
          app,
          'post',
          route,
          data,
          fileObject,
        );

        expect(res.message).toEqual(errMessage);
        expect(status).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
      });

      it('Should create success if params valid', async () => {
        const data = {
          title: 'title',
          description: 'description',
        };
        const [status, res] = await getJWTResponseWithFile(
          app,
          'post',
          route,
          data,
          {
            buffer: Buffer.from('a'),
            options: {
              filename: 'test.jpeg',
              contentType: 'image/jpeg',
            },
          },
        );

        expect(res.title).toEqual(data.title);
        expect(res.description).toEqual(data.description);
        expect(res.filePath).toMatch(/\/tmp\/\d+-test\.jpeg/);
        expect(res.userId).toEqual(user.id);
        expect(status).toEqual(HttpStatus.CREATED);
      });
    });
  });

  describe('update', () => {
    let mock = null;
    let post: Post;
    let route: string;

    beforeAll(async () => {
      post = await create(Post, { userId: user.id });
      route = `posts/${post.id}`;
    });

    afterAll(async () => {
      await dataSource.getRepository(Post).delete(post.id);
    });

    describe('Error', () => {
      it('Should return error when wrong token', async () => {
        const [status, res] = await getJWTResponse(app, 'patch', route);

        expect(res.message).toEqual('Unauthorized');
        expect(status).toEqual(HttpStatus.UNAUTHORIZED);
      });
    });

    describe('success', () => {
      beforeAll(() => {
        mock = mockJwtVerified(user);
      });

      afterAll(() => {
        mock.mockRestore();
      });

      it('Should update failed if params invalid', async () => {
        const [status, res] = await getJWTResponse(app, 'patch', 'posts/invalid-id');

        expect(res.errors).toEqual([]);
        expect(res.messages).toEqual('リクエストパラメータが正しくない。');
        expect(status).toEqual(HttpStatus.BAD_REQUEST);
      });

      it.each([
        [
          {
            title: '',
            description: 'description',
          },
        ],
        [
          {
            title: 't'.repeat(256),
            description: 'description',
          },
        ],
        [
          {
            title: 'title',
            description: 'd'.repeat(2001),
          },
        ],
      ])('Should update failed if data invalid %#', async (data) => {
        const [status, res] = await getJWTResponse(app, 'patch', route, data);

        expect(res.messages).toEqual('リクエストパラメータが正しくない。');
        expect(status).toEqual(HttpStatus.BAD_REQUEST);
      });

      it('Should update success if params valid', async () => {
        const data = {
          title: 'edit title',
          description: 'edit description',
        };
        const [status, res] = await getJWTResponse(app, 'patch', route, data);

        expect(res.id).toEqual(post.id);
        expect(res.title).toEqual(data.title);
        expect(res.description).toEqual(data.description);
        expect(res.filePath).toEqual(post.filePath);
        expect(status).toEqual(HttpStatus.OK);
      });
    });
  });

  describe('remove', () => {
    let mock = null;
    let post: Post;
    let route: string;

    beforeAll(async () => {
      post = await create(Post, { userId: user.id });
      route = `posts/${post.id}`;
    });

    afterAll(async () => {
      await dataSource.getRepository(Post).delete(post.id);
    });

    describe('Error', () => {
      it('Should return error when wrong token', async () => {
        const [status, res] = await getJWTResponse(app, 'delete', route);

        expect(res.message).toEqual('Unauthorized');
        expect(status).toEqual(HttpStatus.UNAUTHORIZED);
      });
    });

    describe('success', () => {
      beforeAll(() => {
        mock = mockJwtVerified(user);
      });

      afterAll(() => {
        mock.mockRestore();
      });

      it('Should delete failed if params invalid', async () => {
        const [status, res] = await getJWTResponse(app, 'delete', 'posts/invalid-id');

        expect(res.errors).toEqual([]);
        expect(res.messages).toEqual('リクエストパラメータが正しくない。');
        expect(status).toEqual(HttpStatus.BAD_REQUEST);
      });

      it('Should delete success if params valid', async () => {
        const [status] = await getJWTResponse(app, 'delete', route);

        expect(status).toEqual(HttpStatus.OK);
      });
    });
  });
});
