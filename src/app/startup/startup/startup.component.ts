import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';



@Component({
  selector: 'app-startup',
  templateUrl: './startup.component.html',
  animations: [
    
    trigger(
        
      'enterAnimation', [
        state('open', style({
            opacity: 1,
          })),
          state('closed', style({ 
            opacity: 0,
          })),
        transition('closed => open', animate('15s')),
      ]
    )
  ],
  styleUrls: ['./startup.component.css']
})
export class StartupComponent implements OnInit {
    
    start = false;
    loginAsSysAdmin = false;

    constructor() {}
   
    ngOnInit(): void {}

    startup(val : {start : boolean , loginAsSysAdmin : boolean}){

        this.start = val.start
        //Passed as input to logo screen
        this.loginAsSysAdmin = val.loginAsSysAdmin;

    }

}
