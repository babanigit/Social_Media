import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'posts/:id',
    loadChildren: () =>
      import('../../components/open-comments/open-comments.module').then(
        (m) => m.OpenCommentsModule
      ),
  },
  {
    path: 'profile/:id',
    loadChildren: () =>
      import('../../components/open-profile/open-profile.module').then(
        (m) => m.OpenProfileModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
