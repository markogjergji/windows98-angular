import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SystemAdminGuard implements CanActivate {

    constructor(private router: Router,public fireAuth: AngularFireAuth,public firestore : AngularFirestore){}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

            return new Promise((resolve, reject) => {
                this.fireAuth.authState.subscribe((user) => {
                    if (user) {

                        this.firestore.collection("users").doc(user.uid).get().subscribe((data : any) => {
                    
                            if(data.data()["role"] === "system-admin"){
                                resolve(true);
                            }
                            else {
                                this.router.navigate(['/home']);
                                resolve(false);
                            }
        
                        })
                        
                    } else {
                        this.router.navigate(['/home']);
                        resolve(false);
                    }
                });
            });
    }

    
  
}
