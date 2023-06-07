import { Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { DatabaseModule } from './database/database.module';

 


@Module({
  imports: [
    PostsModule,
    ConfigModule.forRoot({
      // validationSchema: Joi.object({
      //   POSTGRES_HOST: Joi.string(),
      //   POSTGRES_PORT: Joi.number(),
      //   POSTGRES_USER: Joi.string(),
      //   POSTGRES_PASSWORD: Joi.string(),
      //   POSTGRES_DB: Joi.string(),
      //   PORT: Joi.number(),
      // })
    }),
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
