import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import * as dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      name: 'seekr-server-cookie',
      cookie: {
        maxAge: 1200000,
      },
      store: app.get('SESSION_STORE'),
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(port, () => {
    console.log('[WEB]', port);
  });
}
bootstrap();
