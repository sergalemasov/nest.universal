import { Module } from '@nestjs/common';
import { join } from 'path';
import { AngularUniversalModule } from './angular-universal/angular-universal.module';
import { EventsModule } from './events/events.module';
import { AppController } from './app.controller';

const BROWSER_DIR = join(process.cwd(), './front/dist/browser');

@Module({
  imports: [
    AngularUniversalModule.forRoot({
      viewsPath: BROWSER_DIR,
      bundle: require('../../front/dist/server/main.js'),
    }),
    EventsModule
  ],
  controllers: [AppController]
})
export class ApplicationModule {}
