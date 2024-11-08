import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainContentComponent } from './main-content.component';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';

import { CreateTweetModule } from '../create-tweet/create-tweet.module';
import { LoggedInUserModule } from '../logged-in-user/logged-in-user.module';
import { OpenCommentsModule } from '../open-comments/open-comments.module';

@NgModule({
  declarations: [MainContentComponent],
  imports: [
    CommonModule,

    CreateTweetModule,
    LoggedInUserModule,
    OpenCommentsModule,
    TimeAgoPipe,
  ],
  exports: [MainContentComponent],
})
export class MainContentModule {}
