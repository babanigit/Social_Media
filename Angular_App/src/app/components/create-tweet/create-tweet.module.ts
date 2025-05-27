import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateTweetComponent } from './create-tweet.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [CreateTweetComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports:[CreateTweetComponent]
})
export class CreateTweetModule { }
