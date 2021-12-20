import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/_services/home.service';
import { SaveImageService } from 'src/app/_services/save-image.service';

@Component({
  selector: 'app-save-image',
  templateUrl: './save-image.component.html',
  styleUrls: ['./save-image.component.css']
})
export class SaveImageComponent implements OnInit {

    unique_key!: number;
    toolbarPreview! : any;
    focused : boolean = false;
    minimized : boolean = false;

    image : string = "";
    imageName : string = "";

    valid = false;
    constructor(private saveImage : SaveImageService,private homeService : HomeService) { }

    ngOnInit(): void {
    }

    save(){
        this.saveImage.save({name : this.imageName , image : this.image})
        this.homeService.remove(this.unique_key);
    }

    checkValid(){
        this.valid = this.imageName.length > 0 ? true : false ;
    }
}
