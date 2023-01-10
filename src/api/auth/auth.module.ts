import { Module } from '@nestjs/common';
import { RegisterModule } from './register/register.module';
import { LoginModule } from './login/login.module';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { SessionEntity } from './entities/session.entity';
import { TypeormStore } from 'connect-typeorm';
import { Repository } from 'typeorm';


@Module({
  imports: [
    RegisterModule,
    LoginModule,
    TypeOrmModule.forFeature([SessionEntity]),
  ],
  providers: [
    {
      provide: 'SESSION_STORE',
      useFactory: async (sessionRepo: Repository<SessionEntity>) => {
        return new TypeormStore().connect(sessionRepo);
      },
      inject: [getRepositoryToken(SessionEntity)],
    },
  ],
})
export class AuthModule {}
