import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpenCommentsComponent } from './open-comments.component';
import { RouterModule, Routes } from '@angular/router';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';
import { CustomDateFormatPipe } from '../../pipes/custom-date-format.pipe';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { FormsModule } from '@angular/forms';

const routes: Routes = [{ path: '', component: OpenCommentsComponent }];

@NgModule({
  declarations: [OpenCommentsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TimeAgoPipe,
    CustomDateFormatPipe,
    LoadingSpinnerComponent,
    FormsModule
  ],
  exports: [OpenCommentsComponent],
})
export class OpenCommentsModule {}
