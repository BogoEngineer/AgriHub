import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  role: String = "";
  //User
  first_name: String;
  last_name: String;
  username: String;
  phone: Number;

  //Company
  full_name: String;
  name_abbr: String;

  password: String;
  email: string;
  date: Date;
  place: String;

  filled: boolean;
  valid_email:boolean;
  valid_password:boolean;

  recaptcha: any;

  constructor(
    private adminService:AdminService,
    private snackBar: MatSnackBar
    ) { }

  ngOnInit(): void {
  }

  register(){
    console.log(this.recaptcha)
    if(this.recaptcha==undefined || this.recaptcha==null ||this.recaptcha==""){
      this.snackBar.open("Please check recaptcha button!", null, {
        duration: 1500
      })
      return;
    }

    if(this.password==null || this.password===""
      || this.date==null
      || this.place==null || this.place===""){
      this.filled = false;
      return;
    }
    if(this.role == "User"){
      if(this.username==null || this.username=== "" 
        ||this.first_name==null ||this.first_name===""
        || this.last_name==null || this.last_name===""
        || this.phone==null){
           this.filled = false;
           return;
        }
    }else if(this.role =="Company"){
      if(this.full_name=="" || this.full_name==null|| this.name_abbr=="" ||this.name_abbr==null){
        this.filled = false;
        return;
      }
    }
    this.filled = true;
    let email_regex = new RegExp('.+@.+\..+').test(this.email); //fix
    if(!email_regex){
      this.valid_email = false;
      return;
    }else{
      this.valid_email = true;
    }

    let password_regex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])([a-z]|[A-Z]).{6,}$').test(this.password as string);
    if(!password_regex){
      this.valid_password = false;
      return;
    }else{
      this.valid_password = true;
    }

    let status;
    if(this.role == "User") {
      this.adminService.createRequest({
        first_name: this.first_name,
        last_name: this.last_name,
        username: this.username,
        phone: this.phone,
        password: this.password,
        email: this.email,
        date_of_birth: this.date,
        place_of_birth: this.place,
        type: 'user',
        captcha: this.recaptcha
      }).subscribe(res=> {
        status = res.success;
        if(!status){
          this.snackBar.open("Registration failed!", null, {
            duration: 1500
          })
          return;
        }
      })
    }else {
      this.adminService.createRequest({
        full_name: this.full_name,
        abbreviation: this.name_abbr,
        password: this.password,
        email: this.email,
        founding_date: this.date,
        place: this.place,
        type: 'company',
        captcha: this.recaptcha
      }).subscribe(res=> {
        status = res.success;
        if(!status){
          this.snackBar.open("Registration failed!", null, {
            duration: 1500
          })
          return;
        }
      })
    }

    this.snackBar.open("You have successfully registered, please wait for admin to approve!", null, {
      duration: 1500
    })
    return;
  }

  resolved(captchaResponse){
    this.recaptcha = captchaResponse;
  }
}
