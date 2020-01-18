import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { MessagingModule } from './messaging/messaging.module';

@Module({
  imports: [
    ConfigModule,
    MessagingModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
