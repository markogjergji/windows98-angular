import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store, select } from '@ngrx/store';
import { takeWhile } from 'rxjs/operators';
import { User } from 'src/app/_models/user';
import { UserState } from 'src/app/_store/_reducer/user.reducer';
import { selectUser } from 'src/app/_store/_selector/user.selectors';

@Component({
  selector: 'app-show-image',
  templateUrl: './show-image.component.html',
  styleUrls: ['./show-image.component.css']
})
export class ShowImageComponent implements OnInit,AfterViewInit {

    unique_key!: number;
    toolbarPreview! : any;
    focused : boolean = true;
    minimized : boolean = false;

    image! : string;
    imageLink : string = "";
    imageName : string = "";
    loggedUserId! : string;

    constructor(private firestore : AngularFirestore,
                private store: Store<UserState>){

        this.store.pipe(select(selectUser),takeWhile(s => s.id === undefined,true)).subscribe((s : User) => { 

            this.loggedUserId = s.id!; 

        })

    }

    ngOnInit(): void {}

    ngAfterViewInit(){

        if(this.loggedUserId && this.image){
            this.showImage() 
        } 

    }

    showImage(){

        this.firestore.collection('images').doc(this.loggedUserId).collection("browserImages").doc(this.image).get().subscribe((data : any) => {
            
            this.imageName = data.data()['name'];          
            this.imageLink = data.data()['image'];
            
        })
    }

}
