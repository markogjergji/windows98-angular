import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideocallingComponent } from './videocalling/videocalling.component';
import { MessagingTextComponent } from './messaging-text/messaging-text.component';
import { HomeModule } from '../home.module';
import { MessagingMenuComponent } from './messaging-menu/messaging-menu.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FormsModule } from '@angular/forms';

import { SearchFilterPipe } from '../../_pipes/search-filter.pipe';
import { OnlineFriendsFilterPipe } from 'src/app/_pipes/online-friends-filter.pipe';

@NgModule({
  declarations: [
    SearchFilterPipe,
    OnlineFriendsFilterPipe,
    MessagingMenuComponent,
    VideocallingComponent,
    MessagingTextComponent
  ],
  imports: [
    CommonModule,
    HomeModule,
    FormsModule,
    Ng2SearchPipeModule
  ],
  exports:[
    MessagingMenuComponent,
    VideocallingComponent,
    MessagingTextComponent
    
  ]
})
export class MessagingModule { }
