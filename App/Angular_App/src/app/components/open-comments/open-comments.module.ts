import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpenCommentsComponent } from './open-comments.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: OpenCommentsComponent }
];

@NgModule({
  declarations: [OpenCommentsComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [
    OpenCommentsComponent
  ]
})
export class OpenCommentsModule { }
