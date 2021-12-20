import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/_services/auth.service';
import { HomeService } from 'src/app/_services/home.service';


import { CallType, UserStatus } from 'src/app/_constants/enums';
import { Store, select } from '@ngrx/store';
import { UserState } from 'src/app/_store/_reducer/user.reducer';
import { selectUser } from 'src/app/_store/_selector/user.selectors';
import { take, takeWhile } from 'rxjs/operators';
import { LoadingService } from 'src/app/_services/loading.service';

@Component({
  selector: 'app-messaging-menu',
  templateUrl: './messaging-menu.component.html',
  styleUrls: ['./messaging-menu.component.css'],
  providers:[]
})
export class MessagingMenuComponent implements OnInit,OnDestroy {

    unique_key!: number;
    toolbarPreview! : any;
    focused : boolean = false;
    minimized : boolean = false;

    text = false;
    video = false;
    searchValue:string ="";
    users : Array<any> = [];

    loggedUserId : string | undefined;
    username : string | undefined = "";
    friends : Array<any> = [];
    friendRequest : Array<any> = [];
    openFriendRequests = false;
    userFriends : Array<string> = [];
    friendId : string = "";
    friendUsername : string = "";

    online = UserStatus.online;
    offline = UserStatus.offline;

    status: string = UserStatus.offline;

    constructor(
                private authService : AuthService,
                private firestore : AngularFirestore,
                private homeService : HomeService,
                private store: Store<UserState>,
                private loadingService : LoadingService
                ){

        this.store.pipe(select(selectUser),takeWhile(s => s.id === undefined,true)).subscribe(s => { 

            this.loggedUserId = s.id; 
            this.username = s.username; 
            console.log(s.friends)
            console.log(s)
            this.userFriends = s.friends!;

            if(s.id){
                
                this.changeStatus(UserStatus.online);
                this.showFriends();
                this.setupAnswer();
                this.searchUsers();
                this.showFriendRequests();
            } 
        })

    }

    ngOnInit(): void {

        window.onbeforeunload = () => this.ngOnDestroy();
    }

    ngOnDestroy(){
        this.changeStatus(UserStatus.offline);
        this.firestore.collection('onlineUsers').doc(this.loggedUserId).delete()
    }

    changeStatus(status : UserStatus){
        
        if(this.loggedUserId)
        this.firestore.collection('users').doc(this.loggedUserId).get().subscribe((data : any) => {

            let user = {...data.data()}
            user.status = status;

            this.firestore.collection('users').doc(this.loggedUserId).update({ ...user })
            
        })
        this.firestore.collection('onlineUsers').doc(this.loggedUserId).set({online : "online"});

    }

    searchUsers(){

        this.users = [];
        this.firestore.collection('users').get().subscribe((data) => {
            data.docs.map((doc : any) => {

                if(this.loggedUserId)
                this.firestore.collection('friendRequests').doc(doc.id).collection('requestFromId').doc(this.loggedUserId).get().subscribe((l) => {
            
                    if (l.exists) {
                        this.users = [...this.users , { id: doc.id, ...doc.data(), friendRequestSent : true}]
                    }
                    else {
                        this.users = [...this.users , { id: doc.id, ...doc.data(), friendRequestSent : false}]
                    }
                })
                
            })

        })
    }

    setupAnswer(){

        if(this.loggedUserId)
        this.firestore.collection('calls').doc(this.loggedUserId).collection('offerCandidates').snapshotChanges().subscribe((l : any) => {

            if(l[0] !== undefined)
                if(l[0].type === "added")
                    if(this.loggedUserId)
                        this.homeService.addVideo(this.loggedUserId, l[0].payload.doc.id, CallType.answer);
        }) 

    }

    addFriend(friendUserId : string){


        this.firestore.collection('friendRequests').doc(friendUserId).collection('requestFromId').doc(this.loggedUserId).set({}).then((data : any) => {

            this.searchUsers();
        })
        
    }

    showFriendRequests(){
        //this.friendRequest = [];
        this.firestore.collection('friendRequests').doc(this.loggedUserId).collection('requestFromId').get().subscribe((data) => {
            data.docs.map((doc : any) => {
                console.log(doc.id)
                if(this.loggedUserId)
                this.firestore.collection('users').doc(doc.id).get().subscribe((l : any) => {
                    console.log(l.data())
                   
                    this.friendRequest = [...this.friendRequest, { id: doc.id, ...l.data()}]
                    
                })
                
            })

        })
       /*  if(this.loggedUserId)
        this.firestore.collection('friendRequests').doc(this.loggedUserId).collection('requestFromId').snapshotChanges().subscribe((l : any) => {

            
            l.forEach((doc : any) => {

                if(doc.type === "added"){
                    let id = doc.payload.id
                    this.firestore.collection('users').doc(id).get().subscribe((data : any) => {

                        this.friendRequest.push({ id, ...data.data() })

                    })
                }
            });

        }) */
    }

    acceptFriend(acceptedFriendId : string){

        if(this.loggedUserId)
        this.firestore.collection('users').doc(this.loggedUserId).get().subscribe((data : any) => {

            let arr = [];
            if(data.data())
                arr = data.data()['friends']
            
            if(arr.indexOf(acceptedFriendId) === -1)
                arr.push(acceptedFriendId)

            if(this.loggedUserId)
            this.firestore.collection("users").doc(this.loggedUserId).set({...data.data() , "friends" : arr})
            
        })

        this.firestore.collection('users').doc(acceptedFriendId).get().subscribe((data : any) => {

            let arr = [];
            if(data.data())
                arr = data.data()['friends']

            if(this.loggedUserId)
                if(arr.indexOf(this.loggedUserId) === -1)
                    arr.push(this.loggedUserId)

            this.firestore.collection("users").doc(acceptedFriendId).set({...data.data() , "friends" : arr}).then(() => this.showFriendRequests())
            
        })

        if(this.loggedUserId)
        this.firestore.collection('friendRequests').doc(this.loggedUserId).get().subscribe((data : any) => {

            let arr = [];
            if(data.data())
                arr = data.data()['requestFromId']

            arr = arr.filter((item  : string) => item !== acceptedFriendId)

            this.firestore.collection("friendRequests").doc(this.loggedUserId).set({requestFromId : arr})
            
        })
        

    }
    
    showFriends(){
        
        let displayFriends = (arr : Array<any>) => {
           
            
            this.friends = []
            arr.forEach((id :string , i ,array) => {
                if(id)
                this.firestore.collection('users').doc(id).get().pipe(take(1)).subscribe((data : any) => {
                    this.friends = [...this.friends , { id, ...data.data() }]

                    if(i === array.length -1)
                    {
                        this.friends = this.friends.filter((value, index, self) =>
                                            index === self.findIndex((t) => (
                                                t.id === value.id && t.status === value.status
                                            ))
                                            )
                                            this.loadingService.display(false);
                    }
                        
                })
                
            })
            if(arr.length === 0)
            this.loadingService.display(false);
            
        }

        this.firestore.collection('users').doc(this.loggedUserId).snapshotChanges().subscribe((l : any) => {

            if(l.type === "added"){ 
                
                let arr : Array<any> = [];
                if(l.payload.data())
                    arr = l.payload.data()['friends']
                    
                        this.firestore.collection('onlineUsers').snapshotChanges().subscribe((data : any) => {

                            this.loadingService.display(true);
 
                            displayFriends(arr)

                        })

            }
        
        })

        
    }

    textFriend(friendUsername:string,friendId : string){
        this.friendId = friendId;
        this.friendUsername = friendUsername;
        this.text = true;
    }

    requestsTab(){
        this.openFriendRequests = !this.openFriendRequests;
    }
    
}
