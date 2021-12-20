import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-bios-screen',
  templateUrl: './bios-screen.component.html',
  styleUrls: ['./bios-screen.component.css']
})
export class BiosScreenComponent implements OnInit {

    text : Array<string> = [
        "CD-ROM Device Driver for IDE (Four Channels Supported)",
        "(C)Copyright Oak Technology Inc. 1993-1996",
        "Driver Version : U340",
        "Device Name : Marko",
        "Transfer Mode : Programmed I/0",
        "Drive 0: Port= 1F0 (Primary Channel), Slave IRQ= 14",
        "MSCDEX Version 2.25 \n Copyright (C) Microsoft Corp. 1986-1995. All rights reserved. Drive R: = Driver Marko unit 0",
        "A:\\>"
    ]

    i = 0;
    d = document.createElement("div");
    dotsUp = true;
    typeWriterTimeout : any;

    loginAsSysAdmin = false;

    @Output() start: EventEmitter<{start : boolean , loginAsSysAdmin : boolean}> = new EventEmitter<{start : boolean , loginAsSysAdmin : boolean}>()
    
    constructor() {}

    ngOnInit(): void {
        this.typeWriter();
    }
    
    dots() {
        return new Promise((resolve) => {

            let div = document.createElement("div")
            div.innerText = "Press F2 to login as system administrator";
            document.getElementById("bios-container")!.appendChild(div)

            //Function to check if F2 was pressed during the time the promise is still pending,if pressed the user wants to log in as admin
            let setLogin = (event : any) => {
                if(event.key === 'F2'){
                    this.loginAsSysAdmin = true;
                }
            }
            
            //Add the function to window and remove it when loop is ended
            window.addEventListener("keydown", setLogin)

            
            let i = 0;
            let interval = setInterval( () => {
                let wait = document.querySelector("span") || document.createElement("span");
                
                
                if ( this.dotsUp ) 
                    wait.innerText += ".";
                else {
                    wait.innerText = wait.innerText.substring(1, wait.innerText.length);
                    if ( wait.innerText === "")
                        this.dotsUp = true;
                }
                if ( wait.innerText.length > 2 )
                    this.dotsUp = false;
        
                    if(!document.querySelector("span"))
                    document.getElementById("bios-container")!.appendChild(wait);
                i++;
                
                if (i === 6) {
                    window.removeEventListener("keydown" , setLogin);
                    document.getElementById("bios-container")!.removeChild(div)
                    clearInterval(interval);
                    resolve(true);
                  }
                }, 500);
     
        });
      }

    typeWriter() {

        //Random speed to call the typewriter function so that the boot screen doesn't feel the same each time it is opened
        let speed  = [450, 250, 650, 750 ][Math.floor(Math.random() * 4)];
        if (this.i < this.text.length) {

            if(this.i === 3){
                //Add delay for the dots
                speed = 3200;
                this.dots();
            }
            
            let d = document.createElement("div");
            d.innerText = this.text[this.i];
            d.setAttribute("style","margin-bottom:20px");
            document.getElementById("bios-container")!.appendChild(d);
            this.i++;
            
            this.typeWriterTimeout = setTimeout(this.typeWriter.bind(this), speed);
            
        }else{

            //Loop ended, send startup component the start value and the loginAsAdmin value(true if user pressed F2)
            clearTimeout(this.typeWriterTimeout)
            this.start.emit({start : true, loginAsSysAdmin : this.loginAsSysAdmin});

        }

    }
    

}
