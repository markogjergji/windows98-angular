import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScreensaverComponent } from './screensaver/screensaver.component';
import { ChangeBackgroundComponent } from './change-background/change-background.component';
import { HomeModule } from '../home.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ScreensaverComponent,
    ChangeBackgroundComponent
  ],
  imports: [
    CommonModule,
    HomeModule,
    FormsModule
  ]
})
export class SysAdminModule { }
