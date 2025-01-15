import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpenProfileComponent } from './open-profile.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: OpenProfileComponent }];


@NgModule({
  declarations: [
    OpenProfileComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [OpenProfileComponent]
})
export class OpenProfileModule { }
