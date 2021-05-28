import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import * as passport from 'passport';
import * as session from 'express-session';
import { getRepository } from 'typeorm';
import { TypeORMSession } from './sessions/session.entity'
import { TypeormStore } from 'connect-typeorm'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  const configService = app.get(ConfigService);
  const sessionRepo = getRepository(TypeORMSession)
  // TODO use session connect store from typeORM
  app.use(
    session({
	  cookie: {
		  maxAge: 6000,
	  },
      secret: 'keyboard-cat',
      resave: false,
      saveUninitialized: false,
	  store: new TypeormStore().connect(sessionRepo),
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.use((req, _, next) => {
    next();
  })

  await app.listen(configService.get('port'));
}
bootstrap();
