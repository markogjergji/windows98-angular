import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
//import { User } from '../_models/user';
import { AuthService } from '../_services/auth.service';
import { UserState } from '../_store/_reducer/user.reducer';
import { selectUser } from '../_store/_selector/user.selectors';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {User} from '@firebase/auth-types';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedGuard implements CanActivate {

    constructor(private router: Router,public fireAuth: AngularFireAuth){}
    
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

           return new Promise((resolve, reject) => {
                this.fireAuth.authState.subscribe((user) => {
                    if (user) {
                        resolve(true);
                    } else {
                       
                        this.router.navigate(['/login']);
                        resolve(false);
                    }
                });
          });

    }
  
}
