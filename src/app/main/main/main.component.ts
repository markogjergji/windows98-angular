import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { LoadingService } from 'src/app/_services/loading.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {


    loading = false;
    loadingEl : ElementRef | undefined;
    top = 0
    left = 0
    @ViewChild('loadingEl', { static: false }) set content(content: ElementRef) {
        if(content) {
            this.loadingEl  = content;
        }
    }
    
    constructor(private loadingService : LoadingService,private changeDetectorRef: ChangeDetectorRef) { 

        this.loadingService.status.subscribe((val: boolean) => {
                this.loading = val; 
        });

    }

    ngOnInit(): void {
    }

    @HostListener('window:mousemove', ['$event'])
    onMouseMove(event: MouseEvent){

        this.changeDetectorRef.detectChanges();

        if(this.loadingEl){
            this.top = event.clientY - 18
            this.left =  event.clientX + 2
            //this.loadingEl.nativeElement.style.top = (event.clientY - 18) + "px";
            //this.loadingEl.nativeElement.style.left = ( event.clientX +2 ) + "px";
        }
        
    }

   

}
