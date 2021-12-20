import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StartupComponent } from './startup/startup.component';
import { BiosScreenComponent } from './bios-screen/bios-screen.component';
import { LogoScreenComponent } from './logo-screen/logo-screen.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    StartupComponent,
    BiosScreenComponent,
    LogoScreenComponent,
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [ 
      StartupComponent
  ]
})
export class StartupModule { }
