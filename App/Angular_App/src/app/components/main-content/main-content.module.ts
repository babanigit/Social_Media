import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainContentComponent } from './main-content.component';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';

import { CreateTweetModule } from '../create-tweet/create-tweet.module';
import { OpenCommentsModule } from '../open-comments/open-comments.module';
import { MainWelcomeComponent } from '../main-welcome/main-welcome.component';

@NgModule({
  declarations: [MainContentComponent],
  imports: [
    CommonModule,

    CreateTweetModule,
    OpenCommentsModule,
    MainWelcomeComponent,
    TimeAgoPipe,
  ],
  exports: [MainContentComponent],
})
export class MainContentModule {}
