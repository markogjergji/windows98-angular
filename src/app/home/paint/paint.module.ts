import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaintComponent } from './paint/paint.component';
import { ToolboxComponent } from './toolbox/toolbox.component';
import { WindowComponent } from '../window/window.component';
import { HomeModule } from '../home.module';
import { PaletteComponent } from './palette/palette.component';



@NgModule({
  declarations: [

    PaintComponent,
    ToolboxComponent,
    PaletteComponent,
    
  ],
  imports: [
    CommonModule,
    HomeModule
  ]
})
export class PaintModule { }
