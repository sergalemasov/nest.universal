import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EventsModule } from 'src/events/events.module';
import { UniversalModule } from 'src/universal/universal.module';
import { MaterialModule } from 'src/material/material.module';
import { ChatModule } from 'src/chat/chat.module';

import { AppModule } from './app.module';
import { AppComponent } from './components/app/app.component';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    MaterialModule,
    UniversalModule,
    EventsModule,
    ChatModule,
    NoopAnimationsModule,
    ModuleMapLoaderModule
  ],
  providers: [
    // Add universal-only providers here
  ],
  bootstrap: [ AppComponent ],
})
export class AppServerModule {}
