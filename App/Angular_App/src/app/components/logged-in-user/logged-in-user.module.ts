import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggedInUserComponent } from './logged-in-user.component';



@NgModule({
  declarations: [LoggedInUserComponent],
  imports: [
    CommonModule
  ],
  exports:[LoggedInUserComponent]
})
export class LoggedInUserModule { }
