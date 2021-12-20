import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserComponent } from './browser/browser.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { WindowComponent } from '../window/window.component';
import { FormsModule } from '@angular/forms';
import { HomeModule } from '../home.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  declarations: [
    BrowserComponent,
    
  ],
  imports: [
    CommonModule,
    DragDropModule,
    OverlayModule,
    BrowserAnimationsModule,
    FormsModule,
    HomeModule
  ],
  exports:[
      BrowserComponent
  ]
})
export class BrowserModuleApp { }
