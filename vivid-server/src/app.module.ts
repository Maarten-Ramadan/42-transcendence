import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/user.module';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';

const config = ConfigModule.forRoot({
	load: [configuration],
})

@Module({
  imports: [
    config,
	AuthModule,
	TypeOrmModule.forRootAsync({
		imports:[config],
		useFactory: async (configService: ConfigService) => ({
			type: 'postgres',
			host: configService.get('db.host'),
			port: configService.get('db.port'),
			username: configService.get('db.user'),
			password: configService.get('db.password'),
			database: configService.get('db.database'),
			autoLoadEntities: true,
			synchronize: true
		}),
		inject: [ConfigService]
	  }),
	UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
