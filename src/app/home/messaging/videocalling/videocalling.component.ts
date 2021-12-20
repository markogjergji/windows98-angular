import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';


import { CallType } from 'src/app/_constants/enums';
import { HomeService } from 'src/app/_services/home.service';
import { LoadingService } from 'src/app/_services/loading.service';

@Component({
  selector: 'app-videocalling',
  templateUrl: './videocalling.component.html',
  styleUrls: ['./videocalling.component.css']
})
export class VideocallingComponent implements OnInit, AfterViewInit,OnDestroy {
    unique_key!: number;
    toolbarPreview! : any;
    focused : boolean = true;
    minimized : boolean = false;
    endedCall = false;
    callerId!:string;
    calleeId!:string;
    action!:string;

    servers = {
        iceServers: [
          {
            urls: [],
          },
        ],
        iceCandidatePoolSize: 15,
      };

    pc = new RTCPeerConnection(this.servers);
    localStream : any  = null;
    remoteStream : any = null;

    callDoc : any;
    id : any;
    offerCandidatesId : any;
    answerCandidatesId : any;
    sendChannel! : RTCDataChannel;

    callsCollection : any;

    answerButtonActivated = false;
    denyButtonActivated = false;
    endButtonActivated = false;

    loggedUserId : string | undefined = "";
    loggedUsername : string | undefined = "";
    //@Input('focused') focused: boolean = false;

    @ViewChild("webcamButton") webcamButton! : ElementRef;
    @ViewChild("webcamVideo") webcamVideo! : ElementRef;
    @ViewChild("callButton") callButton! : ElementRef;
    @ViewChild("callInput") callInput! : ElementRef;
    @ViewChild("answerButton")answerButton! : ElementRef;
    @ViewChild("remoteVideo") remoteVideo! : ElementRef;
    @ViewChild("hangupButton") hangupButton! : ElementRef;

    constructor(private firestore : AngularFirestore ,private homeService : HomeService,private loadingService : LoadingService/* ,private store: Store<UserState> */) {

        /* this.store.pipe(select(selectUser)).subscribe(s => {this.loggedUserId = s.id; this.loggedUsername = s.username}) */
    }

    ngOnInit(): void {
        //this.search.searchUsers()
        this.loadingService.display(true);
        this.setupMedia();

        window.onbeforeunload = () => this.ngOnDestroy();
     }

    ngAfterViewInit(): void {}

    ngOnDestroy(){
        this.endCall()
    }

    setupMedia(){

        

        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {

            this.localStream = stream
            this.remoteStream = new MediaStream();

            this.localStream.getTracks().forEach((track : any) => {
                this.pc.addTrack(track, this.localStream);
            });
            
            this.pc.addEventListener("track" , (e) =>{
                e.streams[0].getTracks().forEach((track) => {
                    this.remoteStream.addTrack(track);
                });
            })

            
            this.webcamVideo.nativeElement.srcObject = this.localStream;
            this.remoteVideo.nativeElement.srcObject = this.remoteStream;
        
            console.log(this.action)

            let id ;
            id = this.action === CallType.call ? this.calleeId : this.callerId;

            this.firestore.collection('calls').doc(id).snapshotChanges().subscribe((l : any) => {

                if(l.type == "removed"){
                    this.pc.close();

                    this.localStream.getTracks().forEach((track : any) => {
                        track.stop();
                    });
                    this.remoteStream.getTracks().forEach((track : any) => {
                        track.stop();
                    });
                }
                    
            })

            if(this.action === CallType.call)
                this.setupOffer(this.calleeId)
            else{

                this.answerButtonActivated = true;
                this.denyButtonActivated = true;

            }
                
        })

    }

    setupOffer(id : string){

        this.firestore.collection('calls').doc(id).set({callingFrom : this.callerId}).then( () => {
        this.firestore.collection('calls').doc(id).collection('offerCandidates').doc(id).set({}).then(() => {

            this.pc.addEventListener("icecandidate" , (event) => {
                event.candidate && this.firestore.collection('calls').doc(id).collection('offerCandidates').doc(id).set(event.candidate.toJSON());
                this.firestore.collection('activeCalls').doc(id).set({});
                this.endButtonActivated = true;
                this.loadingService.display(false);
            })

            this.pc.createOffer().then((offerDescription) => {

                this.pc.setLocalDescription(offerDescription).then(() => {
    
                    let offer = {
                        sdp: offerDescription.sdp,
                        type: offerDescription.type,
                    };
                    this.firestore.collection('calls').doc(id).update({ offer })
                    
                })
    
                //On changes of the document of the calls collection
                this.firestore.collection('calls').doc(id).snapshotChanges().subscribe((l : any) => {
                            
                    console.log(l);
                    console.log("docChanged");
    
                    let data = l.payload.data();
    
                    //If the remote ip address doesn't exist and there is an answer in the calls document,then store the answer device sdp
                    
                    if(data.hasOwnProperty("answer"))
                    if (!this.pc.currentRemoteDescription && data["answer"]) {
                        const answerDescription = new RTCSessionDescription(data["answer"]);
                        this.pc.setRemoteDescription(answerDescription);
                        console.log(this.pc.currentRemoteDescription)
                    }

                })

                this.firestore.collection('calls').doc(id).collection('answerCandidates').doc(id).set({}).then((data : any) => {
                        
     
                     //On changes of the answerCandidates document (the call above adds the document, the remote answer adds the ip of the device,thus it gets modified)
                     this.firestore.collection('calls').doc(id).collection('answerCandidates').doc(id).snapshotChanges().subscribe((l : any) => {
                         
                         console.log(l);
                         console.log(l.type)
     
     
                         if (l.type === 'modified') {
                             console.log(l.payload.data())
     
                             //Add the remote ice candidate to the offer rtc client
                             let candidate = new RTCIceCandidate(l.payload.data());
                             this.pc.addIceCandidate(candidate);
     
                             console.log(this.pc)
                             console.log(l.payload.data())
                             
                         }
                         console.log(l.payload.data())
                     })
     
                 })

                })

            });
        })

    }

    setupAnswer(){

            
            this.firestore.collection('calls').doc(this.callerId).get().subscribe((data : any) => {

                let offer = data.data()['offer'];
    
                if(offer)
                this.pc.setRemoteDescription(new RTCSessionDescription(offer)).then(() => {
    
                    this.pc.createAnswer().then((answerDescription) => {
    
                        this.pc.setLocalDescription(answerDescription).then(() => {
                            let answer = {
                                type: answerDescription.type,
                                sdp: answerDescription.sdp,
                            };
        
                            //Update the doc with the answer sdp
                            this.firestore.collection('calls').doc(this.callerId).update({answer}).then(() => {

                                this.firestore.collection('calls').doc(this.callerId).collection('offerCandidates').doc(this.callerId).snapshotChanges().subscribe((l : any)=> {

                                    if (l.type === 'added') {
                                        this.pc.addIceCandidate(new RTCIceCandidate(l.payload.data()));
                                        console.log(this.pc)
                                        this.loadingService.display(false);
                                    }
                                });
                            })
                        });
    
                    });

                })
            
                    this.pc.addEventListener("icecandidate" , (event) => {
                        event.candidate && this.firestore.collection('calls').doc(this.callerId).collection('answerCandidates').doc(this.callerId).set(event.candidate.toJSON());
                        console.log(this.pc)
                        this.firestore.collection('calls').doc(this.callerId).get().subscribe((data : any) => {
                            
                            this.firestore.collection('activeCalls').doc(data.data()['callingFrom']).set({});
                        })
                        
                        this.denyButtonActivated = false;
                        this.answerButtonActivated = false;
                        this.endButtonActivated = true;
                    })

            })


    }

    endCall(){
        
        if(this.action === CallType.call){

            this.firestore.collection('activeCalls').doc(this.calleeId).delete();
            this.firestore.collection('activeCalls').doc(this.callerId).delete();


            this.firestore.collection('calls').doc(this.calleeId).collection("offerCandidates").doc(this.calleeId).delete();
            this.firestore.collection('calls').doc(this.calleeId).collection("answerCandidates").doc(this.calleeId).delete();
            this.firestore.collection('calls').doc(this.calleeId).delete();

        
        }
            
        else{

            this.firestore.collection('activeCalls').doc(this.callerId).delete();

            this.firestore.collection('calls').doc(this.callerId).get().subscribe((data : any) => {
                            
                this.firestore.collection('activeCalls').doc(data.data()['callingFrom']).delete();
            })

            this.firestore.collection('calls').doc(this.callerId).collection("offerCandidates").doc(this.callerId).delete();
            this.firestore.collection('calls').doc(this.callerId).collection("answerCandidates").doc(this.callerId).delete();
            this.firestore.collection('calls').doc(this.callerId).delete();
            
            
            
        }
        //this.homeService.remove(this.unique_key)
        this.endedCall = true;
        

    }


}


