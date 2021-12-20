import { AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { PaintService } from 'src/app/_services/paint.service';

@Component({
  selector: 'app-palette',
  templateUrl: './palette.component.html',
  styleUrls: ['./palette.component.css']
})
export class PaletteComponent implements OnInit,AfterViewInit {

    @ViewChild('palette') palette! : ElementRef;
    @ViewChildren('colorButton') colorButton! : QueryList<any>;
    @ViewChild('selectedColor') selectedColor! : ElementRef;
   

    constructor(private paint : PaintService) { }

    ngOnInit(): void {
    }

    ngAfterViewInit(){
        this.selectedColor.nativeElement.style.backgroundColor = "black";
        this.colorButton.forEach((el : any) => {

            el.nativeElement.style.backgroundColor = el.nativeElement.getAttribute("data-color");

            el.nativeElement.addEventListener("click" , () => {
                this.changeColor(el.nativeElement.getAttribute("data-color"))
            })
        })

    }

    changeColor(color : string){
        this.selectedColor.nativeElement.style.backgroundColor = color;
        this.paint.changeColor(color);
    }
}
