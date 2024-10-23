import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NavbarModule } from './components/navbar/navbar.module';
// import { Demo1Module } from './components/demos/demo1/demo1.module';
import { GetApiService } from './services/get-api.service';
import { HttpClientModule } from '@angular/common/http';
import { MainWelcomeComponent } from './components/main-welcome/main-welcome.component';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';  // Import HttpClientModule

@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NavbarModule,
    // Demo1Module,
    HttpClientModule,

  ],
  providers: [
    provideClientHydration(),
    GetApiService

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
