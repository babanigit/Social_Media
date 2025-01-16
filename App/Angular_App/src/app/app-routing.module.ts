import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'explore',
    loadChildren: () =>
      import('./pages/explore/explore.module').then((m) => m.ExploreModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./components/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./components/register/register.module').then(
        (m) => m.RegisterModule
      ),
  },
  {
    path: 'customers',
    loadChildren: () =>
      import('./pages/customers/customers.module').then(
        (m) => m.CustomersModule
      ),
  },
  {
    path: '**',
    component: NotFoundPageComponent, // Use component directly
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'disabled', // Change this from 'enabled' to 'disabled'
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
