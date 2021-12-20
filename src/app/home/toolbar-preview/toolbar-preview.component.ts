import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component, OnChanges, OnInit } from '@angular/core';
import { AppType } from 'src/app/_constants/enums';
import { HomeService } from 'src/app/_services/home.service';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-toolbar-preview',
  templateUrl: './toolbar-preview.component.html',
  styleUrls: ['./toolbar-preview.component.css']
})
export class ToolbarPreviewComponent implements OnInit {

    unique_key!: number;
    parentRef!: HomeComponent;
    window! : any;
    focused : boolean = false;

    browserImage = "../../../assets/images/Sync Earth.ico";
    paintImage = "../../../assets/images/Paint.ico";
    messagingAppImage = "../../../assets/images/Clipboard with phone.ico";
    showImage = "../../../assets/images/Painting.ico";
    saveImage = "../../../assets/images/Diskette.ico";
    videocallImage = "../../../assets/images/Projector 2.ico";
    screensaverImage="../../../assets/images/Screensaver.ico"
    backgroundAppImage="../../../assets/images/Customize computer.ico"

    icon : string = this.browserImage;
    title : string = "Browser";

    
    
    constructor(private overlay: Overlay,
                private homeService : HomeService)
    {}

    ngOnInit(): void {}

    setTitleAndIcon(type : AppType): void{

        switch (type) {
            case AppType.browser:
                this.icon = this.browserImage;
                this.title = "Browser";
                break;
            case AppType.paint:
                this.icon = this.paintImage;
                this.title = "Paint";
                break;
            case AppType.messaging:
                this.icon = this.messagingAppImage;
                this.title = "Messaging Service";
                break;
            case AppType.showimage:
                this.icon = this.showImage;
                this.title = "Image";
                break;
            case AppType.saveimage:
                this.icon = this.saveImage;
                this.title = "Save Image";
                break;
            case AppType.video:
                this.icon = this.videocallImage;
                this.title = "Videocalling";
                break;
            case AppType.screensaver:
                this.icon = this.screensaverImage;
                this.title = "Change Screensaver";
                break;
            case AppType.background:
                this.icon = this.backgroundAppImage;
                this.title = "Change Background";
                break;
            default:
                break;
        }

    }

    focus(){

        this.homeService.toolbarClicked(this.unique_key);

    }

}
