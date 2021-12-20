import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store, select } from '@ngrx/store';
import { takeWhile } from 'rxjs/operators';
import { User } from 'src/app/_models/user';
import { UserState } from 'src/app/_store/_reducer/user.reducer';
import { selectUser } from 'src/app/_store/_selector/user.selectors';

@Component({
  selector: 'app-change-background',
  templateUrl: './change-background.component.html',
  styleUrls: ['./change-background.component.css']
})
export class ChangeBackgroundComponent implements OnInit {

    unique_key!: number;
    focused : boolean = false;
    minimized : boolean = false;

    id : string | undefined;
    images : Array<any> = [];

    constructor(private firestore : AngularFirestore,private store: Store<UserState>) {

        this.store.pipe(select(selectUser),takeWhile(s => s.id === undefined,true)).subscribe((s : User) => { 

            this.id = s.id!; 

            if(s.id){
                this.showImages() 
            } 
        })
    }

    ngOnInit(): void {}

    showImages(){

        this.firestore.collection('images').doc(this.id).collection('browserImages').snapshotChanges().subscribe((l : any) => {
            this.images = [];

            l.forEach((doc : any) => {

                let id = doc.payload.doc.id
                this.images = [...this.images,{ id, ...doc.payload.doc.data() }]
                       
            })

        })
    
    }

    setBackground(id : string){

        this.firestore.collection('settings').doc(this.id).collection('background').doc(this.id).set({image : id})

    }

}
