import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, HostListener, Output, EventEmitter, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { HomeService } from 'src/app/_services/home.service';

const enum Status {
  OFF = 0,
  RESIZE = 1
}

@Component({
  selector: 'app-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.css']
})

export class WindowComponent implements OnInit,AfterViewInit,OnChanges{

    width: number = 903;
    height: number = 453;
    left: number = 200;
    top: number = 50;

    lastWidth: number = 0;
    lastHeight: number = 0;
    lastLeft: number = 0;
    lastTop: number = 0;

    maximized : boolean = false;
    minimized : boolean = false;

    @ViewChild("box") box! : ElementRef;
    @ViewChild("browserWindow") browserWindow! : ElementRef;
    
    boxPosition!: { left: number, top: number , right: number, bottom: number};

    mouse!: {x: number, y: number}
    status: Status = Status.OFF;

    dragging = false;
    
    @Input("unique_key") unique_key! : number;
    @Input("focused") focused! : boolean;
    @Input("min") min! : boolean;
    @Input("title") title! : string;
    @Input("endCall") endCall = false;

    constructor(private homeService : HomeService){}

    ngOnInit() {}

    ngAfterViewInit(){

        this.loadBox();

    }
    ngOnChanges(changes: SimpleChanges) {

        this.minimized = this.min;

        if(this.endCall)
            this.closeWindow()

    }
    private loadBox(){
        const {left, top,right,bottom} = this.box.nativeElement.getBoundingClientRect();
        this.boxPosition = {left, top,right,bottom};
    }

    setStatus(event: MouseEvent, status: number){

        this.status = status;

        if(status === 1) {

            event.stopPropagation();
            Array.from(document.getElementsByClassName("resizable-draggable") as HTMLCollectionOf<HTMLElement>).forEach(el => {
                el.style.display = "flex";
                el.style.zIndex = "10000"
            });
        }
        else {
            this.loadBox();
            Array.from(document.getElementsByClassName("resizable-draggable") as HTMLCollectionOf<HTMLElement>).forEach(el => {
                el.style.display = "none";
                el.style.zIndex = "-1";
            });
        }
        
    }
    
    @HostListener('window:drag', ['$event'])
    @HostListener('window:mousemove', ['$event'])
    onMouseMove(event: MouseEvent){
        if(this.status === Status.RESIZE) this.resize(event.clientX,event.clientY);
    }

    private resize(mouseX : any,mouseY : any){

        if(mouseX - this.boxPosition.left > 730)
        this.width = mouseX - this.boxPosition.left;

        if(mouseY - this.boxPosition.top > 430)
        this.height = mouseY - this.boxPosition.top;

        this.browserWindow.nativeElement.style.width = this.width + "px";
        this.browserWindow.nativeElement.style.height = this.height + "px";
        
    }



    closeWindow(){

        this.homeService.remove(this.unique_key);

    }

    maximize(){

        this.maximized = true;
        this.homeService.setFocus(this.unique_key);
    }

    restore(){

        this.maximized = false;
        this.homeService.setFocus(this.unique_key);
    }

    minimize(){

        this.homeService.minimize(this.unique_key);

    }



    @HostListener('click', ['$event, $event.target']) 
    onClick(event: MouseEvent , e : HTMLElement){

        this.homeService.setFocus(this.unique_key);
        
    }


}
