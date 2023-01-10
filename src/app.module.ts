import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ApiModule } from './api/api.module';
import { AuthModule } from './api/auth/auth.module';

@Module({
  imports: [DatabaseModule, ApiModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
