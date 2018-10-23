import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from 'src/material/material.module';

import { ChatComponent } from './components/chat/chat.component';
import { DialogUserComponent } from './components/dialog-user/dialog-user.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  declarations: [ChatComponent, DialogUserComponent],
  entryComponents: [DialogUserComponent],
  exports: [ChatComponent]
})
export class ChatModule { }
