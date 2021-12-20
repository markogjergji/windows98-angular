import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store, select } from '@ngrx/store';
import { map, takeWhile } from 'rxjs/operators';
import { User } from '../_models/user';
import { UserState } from '../_store/_reducer/user.reducer';
import { selectUser } from '../_store/_selector/user.selectors';
import { AuthService } from './auth.service';
import { HomeService } from './home.service';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root'
})
export class SaveImageService {

    id : string | undefined;

    constructor(private homeService : HomeService, 
                private auth : AuthService, 
                private firestore : AngularFirestore,
                private store: Store<UserState>,
                private loadingService : LoadingService) {
        
        this.store.pipe(select(selectUser),takeWhile(s => s.id === undefined,true)).subscribe((s : User) => { 

            this.id= s.id!; 

        })

    }

    saveBrowserImage(image : string){

        this.homeService.addSaveImage(image);

    }

    save(image : Object){

        this.loadingService.display(true);
        if(this.id)
        this.firestore.collection('images').doc(this.id).collection('browserImages').add({...image}).then(() => this.loadingService.display(false));

    }

    removeImage(image : string){

        this.loadingService.display(true);
        if(this.id)
        this.firestore.collection('images').doc(this.id).collection('browserImages').doc(image).delete().then(() => this.loadingService.display(false));

    }

}
