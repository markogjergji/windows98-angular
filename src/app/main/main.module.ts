import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { StartupModule } from '../startup/startup.module';
import { AuthenticateModule } from '../authenticate/authenticate.module';
import { AppRoutingModule } from '../app-routing.module';
import { HomeModule } from '../home/home.module';
import { NotFoundComponent } from './not-found/not-found.component';



@NgModule({
  declarations: [
    MainComponent,
    NotFoundComponent
  ],
  imports: [
    CommonModule,
    StartupModule,
    AuthenticateModule,
    AppRoutingModule,
    HomeModule
  ],
  exports: [
      MainComponent
  ]
})
export class MainModule { }
