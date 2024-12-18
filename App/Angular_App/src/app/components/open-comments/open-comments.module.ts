import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpenCommentsComponent } from './open-comments.component';
import { RouterModule, Routes } from '@angular/router';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';
import { CustomDateFormatPipe } from '../../pipes/custom-date-format.pipe';

const routes: Routes = [{ path: '', component: OpenCommentsComponent }];

@NgModule({
  declarations: [OpenCommentsComponent],
  imports: [CommonModule, RouterModule.forChild(routes),
    TimeAgoPipe,
    CustomDateFormatPipe
  ],
  exports: [OpenCommentsComponent],
})
export class OpenCommentsModule {}
