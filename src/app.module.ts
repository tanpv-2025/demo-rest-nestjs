import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { DatabaseModule } from './database.module';
import { RequestLoggerMiddleware } from './logger/request-logger.middleware';
import { AsyncRequestContextModule } from './async-request-context/async-request-context.module';
import { LoggerModule } from './logger/logger.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { TagModule } from './tag/tag.module';
import { MailModule } from './mail/mail.module';
import queueConfig from './queue/queue.config';

@Module({
  imports: [
    DatabaseModule,
    AsyncRequestContextModule.forRoot({ isGlobal: true }),
    LoggerModule,
    UserModule,
    AuthModule,
    PostModule,
    TagModule,
    MailModule,
    BullModule.forRoot(queueConfig),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
