import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AppRoutingModule } from '../app-routing.module';
import { Router } from '@angular/router';
import { WindowComponent } from './window/window.component';
import { ToolbarPreviewComponent } from './toolbar-preview/toolbar-preview.component';
import { PaintModule } from './paint/paint.module';
import { HomeService } from '../_services/home.service';
import { SaveImageComponent } from './save-image/save-image.component';
import { FormsModule } from '@angular/forms';
import { ShowImageComponent } from './show-image/show-image.component';


@NgModule({
  declarations: [
    WindowComponent,
    HomeComponent,

    ToolbarPreviewComponent,
     SaveImageComponent,
     ShowImageComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    FormsModule,
    DragDropModule,
  ],
  exports:[
    WindowComponent,
    HomeComponent,

    ToolbarPreviewComponent
  ],

})
export class HomeModule { }
