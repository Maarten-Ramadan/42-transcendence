import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserEntity } from './models/user.entity';
import { UserController } from './user.controller';
import { TypeORMSession } from 'src/sessions';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, TypeORMSession])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
