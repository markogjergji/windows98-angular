import { Injectable} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UserRole } from '../_constants/enums';
import { User } from '../_models/user';
import { saveUser } from '../_store/_action/user.actions';
import { UserState } from '../_store/_reducer/user.reducer';
import { selectUser } from '../_store/_selector/user.selectors';


@Injectable({
  providedIn: 'root'
})
export class AuthService {


    constructor(public firestore: AngularFirestore,public fireAuth: AngularFireAuth,public router: Router,private store: Store<UserState>) {

        this.fireAuth.authState.subscribe(user => {

            if (user) {

                this.firestore.collection("users").doc(user.uid).get().subscribe((data : any) => {
                    
                    //Store in state the id of user document and it's data
                    this.store.dispatch(saveUser({ id: user.uid , ...data.data() }));

                })
                
            } 

        })
        
    }

    async signIn(email : string, password : string){
        this.fireAuth.signInWithEmailAndPassword(email, password).then((result) =>{

            if(this.router.url === "/login/sysadmin"){
                //Navigate to sysadmin if user presses F2 and is in the login/sysadmin
                //Auth guard prevents the page from accessing if not a sys admin
                this.router.navigate(['home/sysadmin']);
            }else{
                this.router.navigate(['home']);
            }
            
        }).catch(error => {

            //Show firebase error
            window.alert(error.message);
        });
    }
  
    async signUp(firstName : string, lastName : string, username: string,email : string, password : string , role: UserRole) {
        return this.fireAuth.createUserWithEmailAndPassword(email, password)
            .then((result : any) => {

                let user = {
                    firstName,
                    lastName,
                    username,
                    email,
                    friends : [],
                    role:role,
                    status:"offline",
                }

                this.firestore.collection("users").doc(result.user.uid).set(user).then(() => {

                    //Create documents for user: images and desktop settings
                    this.firestore.collection('images').doc(result.user.uid).set({});
                    this.firestore.collection('settings').doc(result.user.uid).collection('screensaver').doc(result.user.uid).set({screensaver : "none"})
                    this.firestore.collection('settings').doc(result.user.uid).collection('background').doc(result.user.uid).set({image : "default"})
                    
                    if(role === UserRole.systemAdmin)
                        this.router.navigate(['home/sysadmin']);
                    else
                        this.router.navigate(['home'])

                });

                
            })
            .catch((error) => {
                window.alert(error.message)
            })
    }

    async signOut() {
        //Sign out and remove from state
        return this.fireAuth.signOut().then(() => {
            this.store.dispatch(saveUser({}));
        })
    }
    
}
