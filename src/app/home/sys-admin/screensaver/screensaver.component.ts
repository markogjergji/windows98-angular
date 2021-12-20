import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store, select } from '@ngrx/store';
import { takeWhile } from 'rxjs/operators';
import { SelectedScreensaver } from 'src/app/_constants/enums';
import { User } from 'src/app/_models/user';
import { HomeService } from 'src/app/_services/home.service';
import { UserState } from 'src/app/_store/_reducer/user.reducer';
import { selectUser } from 'src/app/_store/_selector/user.selectors';

@Component({
  selector: 'app-screensaver',
  templateUrl: './screensaver.component.html',
  styleUrls: ['./screensaver.component.css']
})
export class ScreensaverComponent implements OnInit {
    unique_key!: number;
    focused : boolean = false;
    minimized : boolean = false;

    selectedScreensaver : string = SelectedScreensaver.pipes;
    pipes=SelectedScreensaver.pipes;
    logos=SelectedScreensaver.logos;

    time = [5,15,25,60];
    selectedTime = 5;

    id : string | undefined;

    constructor(private store: Store<UserState> , private firestore : AngularFirestore, private homeService : HomeService ) { 

        this.store.pipe(select(selectUser),takeWhile(s => s.id === undefined,true)).subscribe((s : User) => { 

            this.id = s.id!; 

        })
    }

    ngOnInit(): void {
    }

    setScreensaver(){

        if(this.id)
        this.firestore.collection('settings').doc(this.id).collection('screensaver').doc(this.id)
        .set({screensaver : {type : this.selectedScreensaver , time : this.selectedTime}})
        .then(() => this.homeService.remove(this.unique_key))
    }

    removeScreensaver(){

        if(this.id)
        this.firestore.collection('settings').doc(this.id).collection('screensaver').doc(this.id)
        .set({screensaver : {type : "" , time : 0}})
        .then(() => this.homeService.remove(this.unique_key))
    }

}
