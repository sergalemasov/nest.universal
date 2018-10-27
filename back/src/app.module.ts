import { Module } from '@nestjs/common';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { AngularUniversalModule } from './angular-universal/angular-universal.module';
import { EventsModule } from './events/events.module';
import { MessagesModule } from './messages/messages.module';
import { AppController } from './app.controller';

const BROWSER_DIR = join(process.cwd(), './front/dist/browser');

@Module({
  imports: [
    MessagesModule,
    EventsModule,
    AngularUniversalModule.forRoot({
      viewsPath: BROWSER_DIR,
      bundle: require('../../front/dist/server/main.js'),
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/nest', {retryAttempts: 5})
  ],
  controllers: [AppController]
})
export class ApplicationModule {}
