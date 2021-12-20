import { Component} from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css','../_common-styling/style.css']
})
export class LoginComponent{

    myform: FormGroup;
    email: FormControl;
    password: FormControl;

    constructor(public auth : AuthService) {

        this.email = new FormControl('', Validators.required);
        this.password = new FormControl('', Validators.required);

        this.myform = new FormGroup({
            email: this.email,
            password: this.password
        });
    }

    login(){
        this.auth.signIn(this.email.value,this.password.value);
    }

}
