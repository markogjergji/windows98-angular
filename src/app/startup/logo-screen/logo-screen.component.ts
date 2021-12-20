import { Component, Input, OnInit } from '@angular/core';
import { trigger, state, style, animate,transition } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';


@Component({
  selector: 'app-logo-screen',
  templateUrl: './logo-screen.component.html',
  animations: [

    //Animation triggered on the start variable change
    trigger(
      'enterAnimation', [
        state('open', style({
            opacity: 1,
          })),
          state('closed', style({ 
            opacity: 0,
          })),
        transition('closed => open', animate('2s')),
      ]
    )
  ],
  styleUrls: ['./logo-screen.component.css']
})

export class LogoScreenComponent implements OnInit {


    i = 0;
    j = 3;
    k = 0;
    cycles = 39;
    start = false;
    logoTimeout : any ;
    startTimeout : any;
    startLogoTimeout : any;
    restart = false;
    logout = false;
    action : any ;
    @Input("loginAsSysAdmin") loginAsSysAdmin! : boolean;

    constructor(public router: Router,private route: ActivatedRoute,private auth : AuthService) {

        //LogoScreenComponent gets rendered from home/logout and home/restart
        this.route.params.subscribe( params => {
            if(params.action === "restart"){
                this.restart = true;
                this.cycles = 26;
            }
                
            else if(params.action  === "logout"){
                this.logout = true;
                this.cycles = 26;
                
            }
                
        });
    }
    

    ngOnInit(){
        setTimeout(() => this.start = true, 1000);
        setTimeout(() => this.loadingBar(), 2500);
    }

    loadingBar(){

        let b = document.querySelector("#loading-bar")! as HTMLDivElement;
        b.style.opacity = "1" ;
        let p = document.querySelector("#loading-bar")!.children as HTMLCollectionOf<HTMLElement>;
        
        //Each div is a blue rectangle. Every 100 ms make visible the next div (j) and set opacity to 0 (i) for the previous div. 14 means the end of the bar(the last div).
        if (this.k < this.cycles) {
            if(this.j === 14)
                this.j = 0
            if(this.i === 14)
                this.i = 0;
            p[this.j].style.opacity = "1";
            p[this.i].style.opacity = "0";
            this.i++;
            this.j++;
            this.k++;
            this.logoTimeout = setTimeout(this.loadingBar.bind(this),100)
            
        }else{
            clearTimeout(this.logoTimeout)
            clearTimeout(this.startLogoTimeout)
            clearTimeout(this.startTimeout)

            if(this.restart)
                this.router.navigate(['/']);
            else if(this.logout){
                this.auth.signOut();
                this.router.navigate(['login']);
            }
            else if(this.loginAsSysAdmin)
                this.router.navigate(['login/sysadmin'])
            else
                this.router.navigate(['home']);
        }
    }
    
  
}
