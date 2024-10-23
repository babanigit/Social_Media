import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';

// const routes: Routes = [];
const routes: Routes = [

  {
    path: '',
    loadChildren: () =>
      import('./pages/home/home.module').then(
        (m) => m.HomeModule
      ),
  },
  {
    path: 'explore',
    loadChildren: () =>
      import('./pages/explore/explore.module').then((m) => m.ExploreModule),
  },

  { path: 'customers', loadChildren: () => import('./pages/customers/customers.module').then(m => m.CustomersModule) },

  { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },

  { path: 'explore', loadChildren: () => import('./pages/explore/explore.module').then(m => m.ExploreModule) },
  {
    path: '**',
    component: NotFoundPageComponent // Use component directly
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
