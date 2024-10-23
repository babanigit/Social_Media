import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainContentComponent } from './main-content.component';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';



@NgModule({
  declarations: [
    MainContentComponent,
    TimeAgoPipe,

  ],
  imports: [
    CommonModule
  ],
  exports: [MainContentComponent]
})
export class MainContentModule { }
