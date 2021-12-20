import { AfterViewChecked, AfterViewInit, Component, DoCheck, ElementRef, OnChanges, OnInit, ViewChild } from '@angular/core';
import { NgxCaptureService } from 'ngx-capture';
import * as p5 from 'p5';
import { PaintService } from 'src/app/_services/paint.service';
import { SaveImageService } from 'src/app/_services/save-image.service';

@Component({
  selector: 'app-paint',
  templateUrl: './paint.component.html',
  styleUrls: ['./paint.component.css'],
  providers : [PaintService]
})
export class PaintComponent implements OnInit,AfterViewInit,DoCheck {

    unique_key!: number;
    focused : boolean = false;
    minimized : boolean = false;
    @ViewChild("paintCon") paintCon! : ElementRef;
    canvas : any;


    constructor(private draw : PaintService,private captureService:NgxCaptureService,private saveImage : SaveImageService) { }

    ngOnInit(): void {}

    ngAfterViewInit(){

        this.canvas = this.draw.init(this.paintCon.nativeElement);

    }

    ngDoCheck(){
        this.draw.focused = this.focused;
    }

    save(){

        this.captureService.getImage(this.paintCon.nativeElement, true).subscribe( img => {

            this.saveImage.saveBrowserImage(img);

        })
    }

    undo(){

        this.draw.undo = true;

    }

}
