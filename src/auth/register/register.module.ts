import { Module } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { UserService } from '../../api/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../api/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [RegisterService, UserService],
  controllers: [RegisterController],
})
export class RegisterModule {}
