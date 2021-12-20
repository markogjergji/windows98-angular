import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, takeWhile } from 'rxjs/operators';
import { AuthService } from 'src/app/_services/auth.service';
import { HomeService } from 'src/app/_services/home.service';

import { HomeComponent } from '../../home/home.component';

import { CallType } from 'src/app/_constants/enums';
import { Store, select } from '@ngrx/store';
//import { call } from 'jasmine';
import { UserState } from 'src/app/_store/_reducer/user.reducer';
import { selectUser } from 'src/app/_store/_selector/user.selectors';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-messaging-text',
  templateUrl: './messaging-text.component.html',
  styleUrls: ['./messaging-text.component.css']
})
export class MessagingTextComponent implements OnInit,OnChanges,AfterViewInit {

    unique_key!: number;
    focused : boolean = false;
    minimized : boolean = false;
    loggedUserId! : string;
    textMessages : Array<any> = [];
    textValue:string = "";
    loggedUsername : string | undefined = "";
    activateSenderClass = true;
    openVideoApp = false;
    callCondition = true;
    @Input("friendId") friendId! : string;
    @Input("friendUsername") friendUsername! : string;
    @ViewChild("users") users! : ElementRef;
    @ViewChild("newMessageAtBottom") newMessageAtBottom! : ElementRef;
    
    
    
    constructor(
                public authService : AuthService,
                public firestore : AngularFirestore,
                private homeService : HomeService,
                private store: Store<UserState>
                ){
                    
        this.store.pipe(select(selectUser),takeWhile(s => s.id === undefined,true)).subscribe((s : User) => { 

            this.loggedUserId = s.id!; 
            this.loggedUsername = s.username; 

            if(s.id){
                this.init() 
            } 
        })

    }


    ngOnInit(): void {
        this.init()  
    }
    ngAfterViewInit() {
        this.scrollToBottom();
    }

    ngOnChanges(): void{
        this.init()
    }
   

    init(){
        this.setupMessages();
        this.showTexts();
        this.setupVideocallAnswering();
    }

    setupMessages(){

        this.firestore.collection('texts').doc(this.loggedUserId).get().subscribe((doc) => {

            if (!doc.exists) {

                this.firestore.collection('texts').doc(this.loggedUserId).set({}).then(() => this.firestore.collection('texts').doc(this.loggedUserId).collection(this.friendId).add({}))

                this.firestore.collection('texts').doc(this.friendId).set({}).then(() => this.firestore.collection('texts').doc(this.friendId).collection(this.loggedUserId!).add({}))
            }

        });

    }

    showTexts(){

        this.firestore.collection('texts').doc(this.loggedUserId).collection(this.friendId).snapshotChanges().subscribe((l : any) => {
           
            this.textMessages = [];

            l.forEach((element : any) => {
                
                if(Object.keys(element.payload.doc.data()).length !== 0)
                    this.textMessages.push({...element.payload.doc.data(), date : element.payload.doc.data().date.toMillis()});
                
            });

            this.textMessages.sort((a,b) => a.date - b.date);
            this.scrollToBottom();
        })

    }

    setupVideocallAnswering(){

        this.firestore.collection('activeCalls').doc(this.friendId).get().subscribe((doc) => {
            
            if (doc.exists) {
                this.callCondition = false;
            }

        })

        this.firestore.collection('activeCalls').doc(this.friendId).snapshotChanges().subscribe((l : any) => {
            
            if(l.type === "add"){
                this.callCondition = false;
            }
            else if(l.type === "removed"){
                this.callCondition = true;
            }
                
        })

    }

    sendText(){

        this.firestore.collection('texts').doc(this.loggedUserId).collection(this.friendId).add({}).then(data => {

            this.firestore.collection('texts').doc(this.loggedUserId).collection(this.friendId).doc(data.id).set({
                text : this.textValue,
                date : new Date(),
                sender : this.loggedUsername
            })
        })

        this.firestore.collection('texts').doc(this.friendId).collection(this.loggedUserId).add({}).then(data => {

            this.firestore.collection('texts').doc(this.friendId).collection(this.loggedUserId).doc(data.id).set({
                text : this.textValue,
                date : new Date(),
                sender : this.loggedUsername
            })
            .then(() =>  this.textValue = "")
        })
       
        
    };

    call(){
        
        if(this.callCondition)
            if(this.loggedUserId)
                this.homeService.addVideo(this.loggedUserId, this.friendId, CallType.call)
        
    }

    scrollToBottom(){
        this.newMessageAtBottom.nativeElement.scrollIntoView(false);
    }
}
