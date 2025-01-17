import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateCommentComponent } from './create-comment.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    CreateCommentComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports:[
    CreateCommentComponent
  ]
})
export class CreateCommentModule { }
