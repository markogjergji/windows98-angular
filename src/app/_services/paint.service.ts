import { HostListener, Injectable } from '@angular/core';
import * as p5 from 'p5';
import { SelectedTool } from '../_constants/enums';

@Injectable({
  providedIn: 'root'
})

export class PaintService {

    previousState : Array<any> = [];

    selectedTool = SelectedTool.pencil; 
    color: string = "black";
    dragged = false;

    strokeWeight = 2;
    sprayRadius = 5;
    squareSize = 20;
    circleRadius = 20;
    eraserSize = 2;

    polygonSelectedBefore = false;
    polygonSelected = false;

    undo = false;

    focused = false;

    constructor() {}

    init(el : any){
        return new p5(this.sketch.bind(this) , el);
    }

    sketch (s : any){
        
        s.preload = () => {}

        s.setup = () => {

            s.createCanvas(650, 280);
            s.background(255);
            s.beginShape();
            
        };
        
        s.draw = () => {
            
            s.stroke(String(this.color))
            s.fill(String(this.color))
            
            if(!this.polygonSelected){
                s.endShape();
                s.beginShape();
                s.endShape();
            }
               
            else if(this.polygonSelected && this.polygonSelectedBefore){
                this.polygonSelectedBefore = false
                s.beginShape();
            }

            if (this.undo) {
                s.undoToPreviousState();
                this.undo = false;
            }


            switch (this.selectedTool) {

                case SelectedTool.pencil:

                    if (s.mouseIsPressed) {
                        s.strokeWeight(this.strokeWeight)
                        let lerps = 20

                        for (let i = 0; i < lerps; i++) {

                            let lerpX = s.lerp(s.pmouseX, s.mouseX, i / lerps)
                            let lerpY = s.lerp(s.pmouseY, s.mouseY, i / lerps)

                            if(s.mouseX > 0 && s.mouseY > 0 && s.mouseY < 280){
                                s.line(lerpX, lerpY,s.mouseX, s.mouseY);
                            }
                        }
                        
                    }
                    break;
                

                case SelectedTool.spray:

                    if (s.mouseIsPressed) {

                        let sprayDensity = 100

                        if(this.sprayRadius < 25)
                            sprayDensity = 40
                        s.strokeWeight(1)

                        let r = this.sprayRadius
                        let lerps = 2

                        for (let i = 0; i < lerps; i++) {

                            let lerpX = s.lerp(s.mouseX, s.pmouseX, i / lerps)
                            let lerpY = s.lerp(s.mouseY, s.pmouseY, i / lerps)

                            for (let j = 0; j < sprayDensity; j++) {

                                let randX = s.random(-r, r)
                                let randY = s.random(-1, 1) * s.sqrt((r * r) - randX * randX)

                                if(s.mouseX > 0 && s.mouseY > 0 && s.mouseY < 280){
                                    s.point(lerpX + randX, lerpY + randY)
                                }
                            }
                        }
                    }
                break;

                case SelectedTool.polygon:
                    
                    if (s.mouseIsPressed) {
                        
                        s.strokeWeight(2)
                        s.stroke(String(this.color))

                        if(s.mouseX > 0 && s.mouseY > 0 && s.mouseY < 280){
                            //s.line(s.pmouseX, s.pmouseY, s.mouseX, s.mouseY)
                            s.point(s.mouseX, s.mouseY);
                            s.vertex(s.mouseX, s.mouseY);
                        }
                        
                    }

                break;
                
                case SelectedTool.square:

                     if (s.mouseIsPressed && !this.dragged) {

                        s.strokeWeight(2)
                        if(s.mouseX > 0 && s.mouseY > 0 && s.mouseY < 280){
                            s.rect(s.mouseX - (this.squareSize/2), s.mouseY - (this.squareSize/2), this.squareSize);
                        }
                    }

                break;


                case SelectedTool.circle:

                    if (s.mouseIsPressed && !this.dragged) {

                        s.strokeWeight(2)
                        if(s.mouseX > 0 && s.mouseY > 0 && s.mouseY < 280){
                            s.ellipse(s.mouseX, s.mouseY, this.circleRadius , this.circleRadius)
                        }
                    }

                break;

               
                case SelectedTool.eraser:

                    if (s.mouseIsPressed) {
                        s.noStroke();
                        s.fill('white');

                        let lerps = 20

                        for (let i = 0; i < lerps; i++) {

                            let lerpX = s.lerp(s.pmouseX, s.mouseX, i / lerps)
                            let lerpY = s.lerp(s.pmouseY, s.mouseY, i / lerps)

                            if(s.mouseX > 0 && s.mouseY > 0 && s.mouseY < 280){
                                s.rect(lerpX - (this.eraserSize/2), lerpY - (this.eraserSize/2), this.eraserSize)
                            }
                        }
                    }
                    
                break;
                    

                default:
                    break;
            }
        }

        s.keyPressed = (e : any) => {
            if (e.keyCode == 90 && (e.ctrlKey) && !this.dragged) {
              s.undoToPreviousState();
            }
        }

        s.mouseDragged = () => {
            this.dragged = true;
        }
        
        s.mouseReleased = (e : any) => {
            this.dragged = false;
        }

        s.mousePressed = (e : any) => {
            this.focused ? s.loop() : s.noLoop()
            if(s.mouseX < 400 && s.mouseX > 0 && s.mouseY < 400 && s.mouseY > 0)
                s.saveState();
        }

        s.saveState = () => {
            this.previousState.push(s.get());
        }

        s.undoToPreviousState = () => {

            if (this.previousState.length === 0) {
              return;
            }

            s.background(255);
            s.image(this.previousState.pop(), 0, 0);

        }
           
    };

    changeTool(tool : number){

        if(tool === SelectedTool.polygon){
            if(!this.polygonSelected){
                this.polygonSelected = true;
                this.polygonSelectedBefore = false;
            }
            else{
                this.polygonSelected = false;
                this.polygonSelectedBefore = false;
            }
        }
        else{
            this.polygonSelected = false;
            this.polygonSelectedBefore = false;
        }
            
        this.selectedTool = tool;
    }

    changeColor(color : string){
        this.color = color;
    }

    changeSize(tool : SelectedTool , size : number){
        switch (tool) {
            case SelectedTool.pencil:
                this.strokeWeight = size;
                break;
            case SelectedTool.spray:
                this.sprayRadius = size;
                break;
            case SelectedTool.eraser:
                this.eraserSize = size;
                break;
            case SelectedTool.square:
                this.squareSize = size;
                break;
            case SelectedTool.circle:
                this.circleRadius = size;
                break;
            default:
                break;
        }
    }

    changedFocus(focused : boolean){
        this.focused = focused;
    }
}



