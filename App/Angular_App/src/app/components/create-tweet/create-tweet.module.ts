import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateTweetComponent } from './create-tweet.component';



@NgModule({
  declarations: [CreateTweetComponent],
  imports: [
    CommonModule
  ],
  exports:[CreateTweetComponent]
})
export class CreateTweetModule { }
