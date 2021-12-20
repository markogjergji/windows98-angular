import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChild,ViewChildren } from '@angular/core';
import { PaintService } from 'src/app/_services/paint.service';

import { SelectedTool } from 'src/app/_constants/enums';

@Component({
  selector: 'app-toolbox',
  templateUrl: './toolbox.component.html',
  styleUrls: ['./toolbox.component.css']
})
export class ToolboxComponent implements OnInit,AfterViewInit{

    @ViewChildren('tool') tool! : QueryList<any>;
    @ViewChildren('size') size! : QueryList<any>;

    @Input('focused') focused = false;
    @Input('canvas') canvas! : HTMLDivElement;

    selectedTool : any = {
        pencil : true,
        spray : false,
        rectangle : false, 
        circle : false,
        polygon : false,
        eraser : false
    }

    constructor(private paint : PaintService) { }

    ngOnInit(): void {}

    ngAfterViewInit(){

        this.canvas.style.cursor = "url('../../../../assets/images/pencil.png') 5 12, auto";
        
        this.tool.forEach((el : any) => {

            el.nativeElement.style.backgroundColor = el.nativeElement.getAttribute("tool-type");

            el.nativeElement.addEventListener("click" , () => {

                this.tool.forEach((e : any) => {
                    if(e.nativeElement.id === (e.nativeElement.getAttribute("tool-type") + "-" + "selected") )
                        e.nativeElement.id = e.nativeElement.getAttribute("tool-type")
                })


                el.nativeElement.id = el.nativeElement.getAttribute("tool-type") + "-" + "selected";
                this.canvas.style.cursor = "url('../../../../assets/images/" + el.nativeElement.getAttribute("tool-type") + ".png') 5 12, auto";
                this.changeTool(el.nativeElement.getAttribute("tool-type"))
            })

        })

        this.addSizeListeners();

        this.size.changes.subscribe(
            (next: QueryList<ElementRef>) => {
                this.addSizeListeners();
             }
        );

    }

    addSizeListeners(){

        this.size.forEach((el : any) => {

            el.nativeElement.addEventListener("click" , () => {

                this.size.forEach((e : any) => {
                    if(e.nativeElement.classList.contains("selected-size") )
                        e.nativeElement.classList.remove("selected-size")
                })


                el.nativeElement.classList.add("selected-size")
                
                this.changeSize(el.nativeElement.children[0].getAttribute("tool-type"),parseInt(el.nativeElement.children[0].getAttribute("size")))
            })

        })
    }


    changeTool(tool : string){
        for (const key in this.selectedTool) {
             this.selectedTool[key] = false;
        }
        switch (tool) {

            case "pencil":
                this.selectedTool.pencil = true;
                this.paint.changeTool(SelectedTool.pencil);
            break;

            case "spray":
                this.selectedTool.spray = true;
                this.paint.changeTool(SelectedTool.spray);
            break;

            case "eraser":
                this.selectedTool.eraser = true;
                this.paint.changeTool(SelectedTool.eraser);
            break;

            case "polygon":
                this.selectedTool.polygon = true;
                this.paint.changeTool(SelectedTool.polygon);
            break;

            case "rectangle":
                this.selectedTool.rectangle = true;
                this.paint.changeTool(SelectedTool.square);
            break;

            case "circle":
                this.selectedTool.circle = true;
                this.paint.changeTool(SelectedTool.circle);
            break;

            default:
                break;
        }
       
    }

    changeSize(tool : string , size : number){

        switch (tool) {

            case "pencil":
                this.selectedTool.pencil = true;
                this.paint.changeSize(SelectedTool.pencil,size);
            break;

            case "spray":
                this.selectedTool.spray = true;
                this.paint.changeSize(SelectedTool.spray,size);
            break;

            case "eraser":
                this.selectedTool.eraser = true;
                this.paint.changeSize(SelectedTool.eraser,size);
            break;

            case "rectangle":
                this.selectedTool.rectangle = true;
                this.paint.changeSize(SelectedTool.square,size);
            break;

            case "circle":
                this.selectedTool.circle = true;
                this.paint.changeSize(SelectedTool.circle,size);
            break;

            default:
                break;
        }

    }
    

}
