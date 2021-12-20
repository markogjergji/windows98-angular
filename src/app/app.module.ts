import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainModule } from './main/main.module';
import { RouterModule, Routes } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxCaptureModule } from 'ngx-capture';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AuthenticatedGuard } from './_guards/authenticated.guard';
import { HomeModule } from './home/home.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { BrowserComponent } from './home/browser/browser/browser.component';
import { PaintModule } from './home/paint/paint.module';
import { BrowserModuleApp } from './home/browser/browser.module';
import { MessagingModule } from './home/messaging/messaging.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducer, userFeatureKey } from './_store/_reducer/user.reducer';
import { SysAdminModule } from './home/sys-admin/sys-admin.module';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule,
    OverlayModule,
    DragDropModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgxCaptureModule,
    Ng2SearchPipeModule,
    StoreModule.forFeature(userFeatureKey, reducer),
    MainModule,
    HomeModule,
    BrowserModuleApp ,
    PaintModule,
    MessagingModule,
    SysAdminModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    !environment.production ? StoreDevtoolsModule.instrument() : []
    
  ],
  providers: [AuthenticatedGuard],
  bootstrap: [AppComponent],
  entryComponents:[
      BrowserComponent
  ]
})
export class AppModule { }
