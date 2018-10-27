import { BrowserModule } from '@angular/platform-browser';
import { NgModule, PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { EventsModule } from 'src/events/events.module';
import { UniversalModule } from 'src/universal/universal.module';
import { MaterialModule } from 'src/material/material.module';
import { ChatModule } from 'src/chat/chat.module';
import { StorageModule } from 'src/storage/storage.module';

import { AppComponent } from './components/app/app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    UniversalModule,
    EventsModule,
    ChatModule,
    StorageModule,
    BrowserModule.withServerTransition({ appId: 'app-id' })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string) {
    const platform = isPlatformBrowser(platformId) ?
      'in the browser' : 'on the server';
    console.log(`Running ${platform} with appId=${appId}`);
  }
}
