import { NgModule } from '@angular/core';
import { LoginComponent } from './authenticate/login/login.component';
import { RegisterComponent } from './authenticate/register/register.component';
import { StartupComponent } from './startup/startup/startup.component';
import { AuthenticatedGuard } from './_guards/authenticated.guard';
import {
    Routes,
    RouterModule,
    Router,
    ActivatedRoute,
    CanActivate,
    CanActivateChild,
    CanDeactivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
  } from "@angular/router";
import { HomeComponent } from './home/home/home.component';
import { BrowserComponent } from './home/browser/browser/browser.component';
import { LogoScreenComponent } from './startup/logo-screen/logo-screen.component';
import { SystemAdminGuard } from './_guards/system-admin.guard';
import { RedirectToHomeGuard } from './_guards/redirect-to-home.guard';
import { NotFoundComponent } from './main/not-found/not-found.component';

const routes: Routes = [
    { path: '', component: StartupComponent},
    { path: 'login', component: LoginComponent, canActivate:[RedirectToHomeGuard]},
    { path: 'login/sysadmin', component: LoginComponent,  canActivate:[RedirectToHomeGuard]},
    { path: 'register', component: RegisterComponent, canActivate:[RedirectToHomeGuard]},
    { path: 'home', component: HomeComponent, canActivate:[AuthenticatedGuard]},
    { path: 'home/sysadmin', component: HomeComponent,  canActivate:[SystemAdminGuard]},
    { path: 'home/sysadmin/:action', component: LogoScreenComponent,  /* canActivate:[SystemAdminGuard] */},
    { path: 'home/:action', component: LogoScreenComponent,  canActivate:[AuthenticatedGuard]},
    { path: '**', component: NotFoundComponent}
    
  ];
  
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers:[]
  })
export class AppRoutingModule { }
