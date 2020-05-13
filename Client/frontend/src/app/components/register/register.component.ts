import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  role: String;
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

  constructor() { }

  ngOnInit(): void {
  }

  register(){
    if(this.username==null || this.username=== "" 
      || this.password==null || this.password===""
      || this.date==null
      || this.place==null || this.place===""){
      this.filled = false;
      return;
    }
    if(this.role == "User"){
      if(this.first_name==null ||this.first_name===""
        || this.last_name==null || this.last_name===""
        || this.phone==null){
           this.filled = false;
           return;
        }
    }else if(this.role =="Company"){
      if(this.full_name==null || this.name_abbr==null){
        this.filled = false;
        return;
      }
    }
    this.filled = true;
    let email_regex = new RegExp('^[^@\s]+@[^@\s\.]+\.[^@\.\s]+$').test(this.email); //fix
    if(!email_regex){
      this.valid_email = false;
    }else{
      this.valid_email = true;
    }
    return;
  }
}
