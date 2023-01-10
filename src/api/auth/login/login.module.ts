import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { UserService } from 'src/api/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/api/user/entities/user.entity';
import { LocalStrategy } from '../strategies/local.strategy';
import { SessionSerializer } from 'src/util/session.serializer';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ session: true }),
  ],
  providers: [LoginService, LocalStrategy, UserService, SessionSerializer],
  controllers: [LoginController],
})
export class LoginModule {}
