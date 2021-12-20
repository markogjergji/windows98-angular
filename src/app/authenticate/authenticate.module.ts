import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {RouterModule} from '@angular/router';
import { AuthenticatedGuard } from '../_guards/authenticated.guard';



@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,RouterModule,
    FormsModule,ReactiveFormsModule
  ],
  exports: [
      LoginComponent,
      RegisterComponent
  ],
  providers:[]
})
export class AuthenticateModule { }
