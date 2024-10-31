import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpenCommentsComponent } from './open-comments.component';



@NgModule({
  declarations: [OpenCommentsComponent],
  imports: [
    CommonModule
  ],
  exports:[
    OpenCommentsComponent
  ]
})
export class OpenCommentsModule { }
