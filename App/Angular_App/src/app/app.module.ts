import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarModule } from './components/navbar/navbar.module';
import { GetApiService } from './services/get-api.service';
import { HttpClientModule } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Required for animations
import { ToastrModule } from 'ngx-toastr'; // Import ngx-toastr module

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NavbarModule,
    HttpClientModule,

    BrowserAnimationsModule, // Add BrowserAnimationsModule
    ToastrModule.forRoot({
      // Add ToastrModule with global configuration
      timeOut: 5000,
      positionClass: 'toast-top-right', // Set global position
      preventDuplicates: true,
      closeButton: true,
      progressBar: true,
    }),
  ],
  providers: [provideClientHydration(), GetApiService],
  bootstrap: [AppComponent],
})
export class AppModule {}
