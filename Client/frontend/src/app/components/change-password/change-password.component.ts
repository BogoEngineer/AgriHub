import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  old_password: string;
  new_password: string;
  new_password1: string;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private authenticationService:AuthenticationService
  ) { }

  ngOnInit(): void {
  }

  change(){
    let user = JSON.parse(localStorage.getItem('userInfo'));
    if(user.password != this.old_password){
      this.snackBar.open('Old password is not correct!', null, {
        duration: 1500
      })
      return;
    }
    let valid = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])([a-z]|[A-Z]).{6,}$').test(this.new_password);
    if(!valid){
      this.snackBar.open('New password does not satisfy password requirements!', null, {
        duration: 1500
      })
      return;
    }
    if(this.new_password != this.new_password1){
      this.snackBar.open('New password and new password(again) are different!', null, {
        duration: 1500
      })
      return;
    }
    if(this.new_password == this.old_password){
      this.snackBar.open('New password cant be the old one!', null, {
        duration: 1500
      })
      return;
    }
    this.authenticationService.changePassword(this.new_password).subscribe(res=>{
      localStorage.clear();
      this.router.navigate(['']);
    })
  }
}
