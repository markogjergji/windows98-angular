import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError,map } from 'rxjs/operators';
import { NavigationStart, Router } from '@angular/router';
import { HomeComponent } from '../../home/home.component';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { SaveImageService } from 'src/app/_services/save-image.service';


@Component({
  selector: 'app-browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.css']
})
export class BrowserComponent implements OnInit{

    @Input('focus') public focus!: boolean;
    @ViewChild("frame") frame! : ElementRef;
    @ViewChild("searchEngine") searchEngine! : ElementRef;
    @ViewChild("searchLogo") searchLogo! : ElementRef;
    @ViewChild('rightClick') rightClick!: ElementRef;

    counter = 0;

    unique_key!: number;
    parentRef!: HomeComponent;
    toolbarPreview! : any;
    focused : boolean = false;
    minimized : boolean = false;

    query: string = '';
    submitted : boolean = false;

    htmlObject = document.createElement('div');

    homePage! : HTMLElement;
    historyStack : Array<HTMLElement | string> = [];

    isOpen = false;

    selectedImage : string = "";

    urlBar = "windows98searchbox.com";
    searchButton! : HTMLElement;
    searchElement! : HTMLElement;



    constructor(private http : HttpClient,private router : Router,private saveImage : SaveImageService) {}
    
    ngOnInit(): void {}


    ngAfterViewInit(){

        this.initScript();

    }

    //Get the script for the programmable search api and add it dynamically, because adding it in the dom didn't work
    initScript(){
        let gcse = document.createElement('script');
        gcse.type = 'text/javascript';
        gcse.async = true;
        gcse.src = 'https://cse.google.com/cse.js?cx=fe5880ed39c6669de'
        let s = document.getElementsByTagName('script')[0];
        s.parentNode!.insertBefore(gcse, s);
        this.startEngine()
    }

    startEngine(){

        //Check every 100ms if the script loaded the engine 
        if(this.searchEngine.nativeElement.querySelector("#___gcse_0"))
            this.setupEngine();
        else
            setTimeout( this.startEngine.bind(this), 100 );
    
    }

    setupEngine(){
        //Initially the opacity of the container is 0 so that changes in css get updated when it finishes loading
        this.searchElement = this.searchEngine.nativeElement.querySelector("#___gcse_0");
        this.searchElement.style.opacity = "1";

        this.homePage = this.searchElement.cloneNode(true) as HTMLElement;
        if(this.historyStack.length < 1)
            this.historyStack.push(this.homePage)
        
       
        //DOM manipulation
        this.searchButton = this.searchEngine.nativeElement.querySelector("#___gcse_0 > div > div > form > table > tbody > tr > td.gsc-search-button > button") as HTMLElement;

        if(this.searchButton.firstElementChild)
            this.searchButton.firstElementChild.remove();

        this.searchButton.addEventListener("click" , () => {

            this.searchLogo.nativeElement.style.display = "none";
            

            let checkResultsReady = () => {

                if(!this.searchEngine.nativeElement.querySelector("#___gcse_0 > div > div > div > div.gsc-above-wrapper-area-invisible"))
                    this.search();
                else
                    setTimeout(checkResultsReady.bind(this), 100);

            }
            checkResultsReady();
            
        })
        
    }
    

    search(){ 

        this.historyStack.push(this.searchElement)
        this.fixATags();

    }

    goBack(){

        if(typeof this.historyStack[this.historyStack.length - 1] !== 'string' && this.historyStack.length > 2)
            if(this.searchEngine.nativeElement.firstElementChild)
                    this.searchEngine.nativeElement.firstElementChild.remove();

        if(this.historyStack.length > 1)
            this.historyStack.pop();

        this.onBackOrRefresh();
        
    }

    refresh(){
        this.onBackOrRefresh();
    }

    onBackOrRefresh(){

        if(typeof this.historyStack[this.historyStack.length - 1] === 'string'){
            this.frame.nativeElement.style.display = "block";
            this.frame.nativeElement.src = this.historyStack[this.historyStack.length - 1];
            this.fixATags()
        }
        else{

            if(this.searchEngine.nativeElement.firstElementChild)
                this.searchEngine.nativeElement.firstElementChild.remove();

            this.searchEngine.nativeElement.appendChild(this.historyStack[this.historyStack.length - 1])
            this.frame.nativeElement.style.display = "none";
            this.urlBar = "windows98searchbox.com"

            if(this.historyStack.length === 1){
                this.searchLogo.nativeElement.style.display = "flex";
            }
        }
    }

    home(){

        this.historyStack.push(this.homePage)

        if(this.searchEngine.nativeElement.firstElementChild)
            this.searchEngine.nativeElement.firstElementChild.remove();

        this.frame.nativeElement.style.display = "none";
        this.searchEngine.nativeElement.appendChild(this.historyStack[this.historyStack.length - 1])
       
        this.searchLogo.nativeElement.style.display = "flex";

        this.urlBar = "windows98searchbox.com"
        this.setupEngine();
    }


    fixATags(){

        Array.from(this.searchElement.querySelectorAll("a") as NodeListOf<HTMLElement>).forEach((element:any) => {

            element.setAttribute("target" , "")
            let url = element.href;
            element.setAttribute("href" , "")

            element.addEventListener("click" , (e : Event) => {

                e.stopImmediatePropagation();
                e.stopPropagation();
                e.preventDefault();

                if(this.searchEngine.nativeElement.firstElementChild)
                    this.searchEngine.nativeElement.firstElementChild.remove();

                this.frame.nativeElement.style.display = "block";
                this.frame.nativeElement.src = url;
                this.urlBar = url;

                this.historyStack.push(url);

                
            })
            
        })
    }

    @HostListener('window:contextmenu', ['$event' , '$event.target'])
    onRightClick(e: MouseEvent, t : HTMLElement){

        if (t.tagName === 'IMG') {
            e.preventDefault();
            this.rightClick.nativeElement.style.display = "flex";
            this.rightClick.nativeElement.style.top = e.y + "px";
            this.rightClick.nativeElement.style.left = e.x + "px";
            
            this.selectedImage = (t as HTMLImageElement).src;
        }
        else{
            this.rightClick.nativeElement.style.display = "none";
        }
        
    }
    
    @HostListener('window:click', ['$event' , '$event.target'])
    onLeftClick(e: MouseEvent, t : HTMLElement){


        if(this.rightClick.nativeElement === t){
            this.saveImage.saveBrowserImage(this.selectedImage);
        }
        else{
            this.rightClick.nativeElement.style.display = "none";
        }
        

    }
}
