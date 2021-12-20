import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/_services/auth.service';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { UserRole } from 'src/app/_constants/enums';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css','../_common-styling/style.css']
})
export class RegisterComponent {

    myform: FormGroup;
    firstName: FormControl;
    lastName: FormControl;
    email: FormControl;
    password: FormControl;
    username: FormControl;
    enterKey : FormControl;
    sysAdmin : FormControl;

    allowRegisterAsAdmin = false;
        
    constructor(public auth : AuthService) {

        this.firstName = new FormControl('', [Validators.required , Validators.maxLength(20)]);
        this.lastName = new FormControl('', [Validators.required , Validators.maxLength(20)]);
        this.username = new FormControl('', [Validators.required , Validators.maxLength(20)]);
        this.enterKey = new FormControl('');
        this.sysAdmin = new FormControl('' , this.createPasswordStrengthValidator());

        this.email = new FormControl('', [
            Validators.required,
            Validators.pattern("[^ @]*@[^ @]*")
        ]);

        this.password = new FormControl('', [
            Validators.required,
            Validators.minLength(8)
        ]);

        this.myform = new FormGroup({
            firstName: this.firstName,
            lastName: this.lastName,
            username: this.username,
            email: this.email,
            password: this.password,
            enterKey : this.enterKey,
            sysAdmin : this.sysAdmin
        });
    }

    register(){
        
        //Product key is not required, if it's not valid the role is set to "user"
        if(this.sysAdmin.valid && this.sysAdmin.value != "")
            this.auth.signUp(this.firstName.value,this.lastName.value,this.username.value,this.email.value,this.password.value,UserRole.systemAdmin);
        else
            this.auth.signUp(this.firstName.value,this.lastName.value,this.username.value,this.email.value,this.password.value,UserRole.user)
    }


    createPasswordStrengthValidator(): ValidatorFn {

        return (control:AbstractControl) : ValidationErrors | null => {

            const value = control.value;

            //Check the productCode.code array in env if the value user entered in the product key field exists in the array
            //Returning null means no error
            return ((environment.productCodes.codes.indexOf(value) !== -1) || (value === "")) ? null : {productCodeExists : true} ;
        }
    }

}
