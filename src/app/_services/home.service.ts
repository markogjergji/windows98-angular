import { ChangeDetectorRef, ComponentFactoryResolver, ComponentRef, ElementRef, Injectable, Injector, ViewContainerRef } from '@angular/core';
import { BrowserComponent } from '../home/browser/browser/browser.component';
import { MessagingMenuComponent } from '../home/messaging/messaging-menu/messaging-menu.component';
import { MessagingTextComponent } from '../home/messaging/messaging-text/messaging-text.component';
import { VideocallingComponent } from '../home/messaging/videocalling/videocalling.component';
import { PaintComponent } from '../home/paint/paint/paint.component';
import { SaveImageComponent } from '../home/save-image/save-image.component';
import { ShowImageComponent } from '../home/show-image/show-image.component';
import { ChangeBackgroundComponent } from '../home/sys-admin/change-background/change-background.component';
import { ScreensaverComponent } from '../home/sys-admin/screensaver/screensaver.component';
import { ToolbarPreviewComponent } from '../home/toolbar-preview/toolbar-preview.component';

import { AppType } from '../_constants/enums';
import { LoadingService } from './loading.service';
@Injectable({
  providedIn: 'root'
})
export class HomeService {

    homeApps! : ViewContainerRef;
    toolbarAppsCon! : ViewContainerRef;

    appRef:ComponentRef<BrowserComponent | PaintComponent | MessagingMenuComponent | VideocallingComponent | SaveImageComponent | ShowImageComponent | ScreensaverComponent | ChangeBackgroundComponent>[] = [];
    toolbarRef:ComponentRef<ToolbarPreviewComponent>[] = [];

    unique_key: number = -1;

    focusPriority : number[] = [];

    constructor(private resolver: ComponentFactoryResolver,
                private injector: Injector,
                private loadingService : LoadingService) {}


    init(homeApps : ViewContainerRef, toolbarAppsCon : ViewContainerRef){

        //Get #homeApps and #toolbar to append hostviews
        this.homeApps = homeApps;
        this.toolbarAppsCon = toolbarAppsCon;

    }
    

    addApp(type : AppType) {
        this.loadingService.display(true);
        let factory;

        //Generate a ComponentFactory from a Component 
        switch (type) {
            case AppType.browser:
                factory = this.resolver.resolveComponentFactory(BrowserComponent);
                break;
            case AppType.paint:
                factory = this.resolver.resolveComponentFactory(PaintComponent);
                break;
            case AppType.messaging:
                factory = this.resolver.resolveComponentFactory(MessagingMenuComponent);
                break;
            case AppType.screensaver:
                factory = this.resolver.resolveComponentFactory(ScreensaverComponent);
                break;
            case AppType.background:
                factory = this.resolver.resolveComponentFactory(ChangeBackgroundComponent);
                break;
            default:
                factory = this.resolver.resolveComponentFactory(BrowserComponent);
                break;
        }
        
        //Only 1 instance of the messaging app can be opened
        if(AppType.messaging){
            let componentRef = this.appRef.filter(x => x.instance instanceof MessagingMenuComponent); 
            if(componentRef.length > 0){
                this.loadingService.display(false);
                return
            }
            
        }
        
        //Create a componentref from the factory and push it in the array
        this.appRef.push(factory.create(this.injector));

        //Get the instance of the ref and append a unique key to it
        let childComponent = this.appRef[this.appRef.length - 1].instance;
        childComponent.unique_key = ++this.unique_key;

        //Create toolbar for the ref
        this.finishAdding(type);
    }

    //App for displaying images
    addImage(image : string){
        this.loadingService.display(true);
        let factory = this.resolver.resolveComponentFactory(ShowImageComponent);
        this.appRef.push(factory.create(this.injector));

        let childComponent = this.appRef[this.appRef.length - 1].instance;
        childComponent.unique_key = ++this.unique_key;

        //Send the url of the image to the instance
        if(childComponent instanceof ShowImageComponent){
            childComponent.image = image; 
        }

        this.finishAdding(AppType.showimage);
        
    }

    //App for videocalling
    addVideo(callerId : string, calleeId : string,action : string) {
        this.loadingService.display(true);
        let factory = this.resolver.resolveComponentFactory(VideocallingComponent);
        this.appRef.push(factory.create(this.injector));

        let childComponent = this.appRef[this.appRef.length - 1].instance;
        childComponent.unique_key = ++this.unique_key;

        if(childComponent instanceof VideocallingComponent){
            //Set the ids of the person calling and the person receiving the call
            childComponent.callerId = callerId;
            childComponent.calleeId = calleeId;
            childComponent.action = action;
        }

        this.finishAdding(AppType.video);
    }

    //App for saving image
    addSaveImage(image : string) {
        this.loadingService.display(true);
        let factory = this.resolver.resolveComponentFactory(SaveImageComponent);
        this.appRef.push(factory.create(this.injector));

        let childComponent = this.appRef[this.appRef.length - 1].instance;
        childComponent.unique_key = ++this.unique_key;

        if(childComponent instanceof SaveImageComponent){
            childComponent.image = image;
        }

        this.finishAdding(AppType.saveimage);
    }

    //Insert in the #homeApps the view template using hostview
    finishAdding(type : AppType){
        this.homeApps.insert(this.appRef[this.appRef.length - 1].hostView);
        this.setupToolbar(type);
        this.focusPriority.push(this.unique_key);
        this.setFocus(this.focusPriority[ this.focusPriority.length - 1]);
        this.loadingService.display(false);
    }

    setupToolbar(type : AppType){
        
        //Create a toolbar
        let toolbarFactory = this.resolver.resolveComponentFactory(ToolbarPreviewComponent);

        this.toolbarRef.push(toolbarFactory.create(this.injector));

        let toolbarInstance = this.toolbarRef[this.toolbarRef.length - 1].instance;

        //Set unique key, title of app and icon
        toolbarInstance.unique_key = this.unique_key;
        toolbarInstance.setTitleAndIcon(type);

        this.toolbarAppsCon.insert(this.toolbarRef[this.toolbarRef.length - 1].hostView);

    }

    toolbarClicked(unique_key : number){

        //Get component with the same unique key as the toolbar clicked
        let componentRef = this.appRef.filter(
            x => x.instance.unique_key == unique_key
            )[0]; 

        //If component is minimzed, then unminimize
        if(componentRef.instance.minimized)
        componentRef.instance.minimized = false;

        //If component is not minimized and the component is in focus then minimize
        if(!componentRef.instance.minimized && componentRef.instance.focused)
        componentRef.instance.minimized = true;

        this.setFocus(unique_key);
    }

    minimize(unique_key : number){
        let componentRef = this.appRef.filter(
            x => x.instance.unique_key == unique_key
            )[0]; 

        componentRef.instance.minimized = true;
        componentRef.instance.focused = false;

        let toolbarRef = this.toolbarRef.filter(
            x => x.instance.unique_key == unique_key
        )[0]; 

        toolbarRef.instance.focused = false;
    }


    setFocus(unique_key : number){

        //Make all apps unfocused
        this.appRef.forEach(x => {
            x.instance.focused = false;
        })
        this.toolbarRef.forEach(x => {
            x.instance.focused = false;
        })
        
        //Get app to be focused
        let componentRef = this.appRef.filter(
            x => x.instance.unique_key == unique_key
        )[0]; 

        let toolbarRef = this.toolbarRef.filter(
            x => x.instance.unique_key == unique_key
        )[0]; 

        //If component is minimized
        if(componentRef)
        if(componentRef.instance.minimized){

            //Unfocus
            componentRef.instance.focused = false;
            toolbarRef.instance.focused = false;

            //Find the first unminimized component and focus it
            let notMinimizedComponent = this.appRef.filter(
                x => x.instance.minimized == false
            )[0];

            if(notMinimizedComponent) 
            this.setFocus(notMinimizedComponent.instance.unique_key)
        }
        else{
            
            //Focus app
            componentRef.instance.focused = true;
            toolbarRef.instance.focused = true;

        }
        
    }


    remove(key: number) {

        if (this.homeApps.length < 1) return;

        let componentRef = this.appRef.filter(
            x => x.instance.unique_key == key
        )[0]; 

        //Find index of the componentRef hostview and remove from view
        let homeAppsIndex = this.homeApps.indexOf(componentRef.hostView);

        this.homeApps.remove(homeAppsIndex);

        //Remove componentRef from appRef
        this.appRef = this.appRef.filter(
            x => x.instance.unique_key !== key
        );

        let toolbarRef = this.toolbarRef.filter(
            x => x.instance.unique_key == key
        )[0]; 


        let toolbarIndex: number = this.toolbarAppsCon.indexOf( toolbarRef.hostView);

        this.toolbarAppsCon.remove(toolbarIndex);

        this.toolbarRef = this.toolbarRef.filter(
            x => x.instance.unique_key !== key
        );

        //Set focus to the previous app
        this.setFocus(this.focusPriority[ this.focusPriority.length - 1]);
    }


}


