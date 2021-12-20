import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component, ComponentFactory, ComponentRef,ComponentFactoryResolver, ElementRef, OnInit, ViewChild, ViewContainerRef, AfterViewInit, ChangeDetectorRef, AfterContentChecked, Injector, ViewChildren, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { HomeService } from 'src/app/_services/home.service';
import { BrowserComponent } from '../browser/browser/browser.component';
import { ToolbarPreviewComponent } from '../toolbar-preview/toolbar-preview.component';

import { AppType, SelectedScreensaver, UserRole } from 'src/app/_constants/enums';
import { SaveImageService } from 'src/app/_services/save-image.service';
import { map, take, takeUntil, takeWhile } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store, select } from '@ngrx/store';
import { UserState } from 'src/app/_store/_reducer/user.reducer';
import { selectUser } from 'src/app/_store/_selector/user.selectors';
import { LoadingService } from 'src/app/_services/loading.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit ,AfterViewInit{
    
    username : string | undefined = "";
    clock : Date = new Date();
    padding = 3;
    sysadmin = false;

    images : Array<any> = [];

    selectedApp : Array<boolean> = [false,false,false];

    @ViewChild('con') con!: ElementRef;
    @ViewChild('rightClick') rightClick!: ElementRef;
    @ViewChild('startMenu') startMenu!: ElementRef;
    @ViewChild('homeApps', {read: ViewContainerRef}) homeApps! : ViewContainerRef;
    @ViewChild("toolbarApps", {read: ViewContainerRef}) toolbarAppsCon! : ViewContainerRef;

    selectedImage: string = "";
    startMenuOpened = false;

    id : string | undefined ;

    screensaverType! : SelectedScreensaver;
    selectedTimer! : number;
    settings = false;
    screensaverTimeout! : ReturnType<typeof setTimeout>;

    screensaverActive : { [index: string]: boolean; } = {
        logos : false,
        pipes1 : false,
        pipes2 : false,
        pipes3 : false,
        pipes4 : false
    };

    constructor(private router : Router,
                private route : ActivatedRoute,
                private auth : AuthService,
                private cdref: ChangeDetectorRef, 
                private homeService : HomeService,
                private showImage : SaveImageService,
                private firestore : AngularFirestore,
                private store: Store<UserState>,
                private loadingService : LoadingService){
        
        //If system admin, 2 more apps are shown, padding needed for the 1 click focus of icons
        if(this.router.url === "/home/sysadmin"){
            this.sysadmin = true;
            this.padding = 5;
        }

        this.loadingService.display(true);

        //Get selected user from store
        //It can return {} as first value and after it sends the user it still keeps sending it
        //takeWhile keeps the subscription open until id is not undefined and is inclusive
        //This means the last state is the user object and then the observable is completed
        this.store.pipe(select(selectUser),takeWhile(s => s.id === undefined,true)).subscribe(s => { 

            this.id = s.id; 
            this.username = s.username; 

            if(s.id){
                if(s.role === UserRole.systemAdmin){
                    this.settings = true;
                }
                this.showBackground();
                this.showImages();
                this.checkForScreensaver();
            } 
        })
    }

    ngOnInit(): void {}

    ngAfterViewInit(){

        this.startTime();

        //Scroll toolbars when they get out of view
        this.toolbarAppsCon.element.nativeElement.parentElement.addEventListener('mousewheel', (e : any) => {
            let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
            this.toolbarAppsCon.element.nativeElement.parentElement.scrollLeft -= (delta * 40);
            e.preventDefault();
        });

        this.homeService.init(this.homeApps, this.toolbarAppsCon);
        
    }

    openBrowser(){
        this.homeService.addApp(AppType.browser);
        //View not rendered correctly without detecting changes
        this.cdref.detectChanges();
    }

    openPaint(){
        this.homeService.addApp(AppType.paint);
        this.cdref.detectChanges();
    }

    openMessagingApp(){
        this.homeService.addApp(AppType.messaging);
        this.cdref.detectChanges();
    }

    openImage(id : string){
        this.homeService.addImage(id)
        this.cdref.detectChanges();
    }

    openBackgroundApp(){
        this.homeService.addApp(AppType.background);
        this.cdref.detectChanges();
    }

    openScreensaver(){
        this.homeService.addApp(AppType.screensaver);
        this.cdref.detectChanges();
    }

    focusAppIcon(index : number){
        //Make every app icon unfocused, then focus the app clicked
        this.selectedApp.forEach((element,i,a) => a[i] = false);
        this.selectedApp[index] = true;
    }

    startTime() {
        //Get date every second, access it in view using pipes
        this.clock = new Date();
        setTimeout(this.startTime.bind(this), 1000);
    }

    openStartMenu(){
        this.startMenuOpened = !this.startMenuOpened;
    }


    showBackground(){

        

        this.firestore.collection('settings').doc(this.id).collection('background').doc(this.id).snapshotChanges().subscribe((doc : any) => {

            if(doc.payload.data()["image"]){
               //If background not set, then use the default background
                if(doc.payload.data()["image"] === "default")
                    this.con.nativeElement.style.backgroundImage = "url(../../../assets/images/clouds.jpg)"
                else{
                    this.firestore.collection('images').doc(this.id).collection('browserImages').doc(doc.payload.data()["image"]).get().subscribe((data : any) => {
                        //Else use the background saved
                        this.con.nativeElement.style.backgroundImage = `url(${data.data()['image']})`
                    }) 
                }
            }
            
        })

    }

    showImages(){

        this.firestore.collection('images').doc(this.id).collection('browserImages').snapshotChanges().subscribe((l : any) => {

            //Show images saved
            this.images = [];
            l.forEach((doc : any) => {

                let id = doc.payload.doc.id
                    this.images = [...this.images,{ id, ...doc.payload.doc.data() }]
            })
        })
    
    }


    checkForScreensaver(){

        this.firestore.collection('settings').doc(this.id).collection('screensaver').doc(this.id).snapshotChanges().subscribe((doc : any) => {

            if(doc.payload.data()["screensaver"].hasOwnProperty("type")){
               
                this.screensaverType = doc.payload.data()["screensaver"]["type"];
                this.selectedTimer = parseInt(doc.payload.data()["screensaver"]["time"])
            }

            this.loadingService.display(false);
        })
    }

    setScreensaver(type : SelectedScreensaver){

        if(type === SelectedScreensaver.logos){
            this.screensaverActive.logos = true;
        }
        else if(type === SelectedScreensaver.pipes){

            switch (Math.floor(Math.random() * 4) + 1) {
                case 1:
                    this.screensaverActive.pipes1 = true;
                break;
                case 2:
                    this.screensaverActive.pipes2 = true;
                break;
                case 3:
                    this.screensaverActive.pipes3 = true;
                break;
                case 4:
                    this.screensaverActive.pipes4 = true;
                break;
                default:
                    break;
            }
        }
    }

    @HostListener('window:mousemove', ['$event'])
    onMouseMove(e: MouseEvent){

        if(this.screensaverTimeout){
            //Clear active screensavers and timeout
            for (const key in this.screensaverActive) {
                this.screensaverActive[key] = false;
            }

            clearTimeout(this.screensaverTimeout)
        }
        
        //If screensaver exists and timeout isn't cleared, then show the screensaver
        if(this.screensaverType && this.selectedTimer)
            this.screensaverTimeout = setTimeout(this.setScreensaver.bind(this,this.screensaverType) , this.selectedTimer * 1000)
        
    }

    @HostListener('window:contextmenu', ['$event' , '$event.target'])
    onRightClick(e: MouseEvent, t : HTMLElement){

        //If image in home is right clicked then display the menu
        if (t.classList.contains("addedImg")) {

            e.preventDefault();
            this.rightClick.nativeElement.style.display = "flex";
            this.rightClick.nativeElement.style.top = e.y + "px";
            this.rightClick.nativeElement.style.left = e.x + "px";

            if((t as HTMLImageElement).getAttribute('image-id') !== null)
                this.selectedImage = (t as HTMLImageElement).getAttribute('image-id')!;
        }
        else{
            this.rightClick.nativeElement.style.display = "none";
        }
        
    }
    
    @HostListener('window:click', ['$event' , '$event.target'])
    onLeftClick(e: MouseEvent, t : HTMLElement){

        //If menu clicked then delete the image
        if(this.rightClick.nativeElement === t){
            this.showImage.removeImage(this.selectedImage);
            this.rightClick.nativeElement.style.display = "none";
        }
        else{
            this.rightClick.nativeElement.style.display = "none";
        }
        

    }
    
  
}
