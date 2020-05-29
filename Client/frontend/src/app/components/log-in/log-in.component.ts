import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service'
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
  role: String;

  constructor(
    private authenticationService:AuthenticationService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.role="";
  }

  logIn(){
    let username;
    let password;
    let form;
    let role = this.role.toLowerCase();
    if(role == 'company'){
      form = document.getElementById('company');
      username = form.elements[0].value;
      password = form.elements[1].value;
    }else {
      form = document.getElementById('user');
      username = form.elements[0].value;
      password = form.elements[1].value;
    }
    
    this.authenticationService.logIn(username, password, role).subscribe(res=>{
      if(res.success == false){
        this.snackBar.open(res.msg, null, {
          duration: 1500
        })
        return;
      }
     
      this.router.navigate([role]);
      res.data.role = role;
      localStorage.setItem('userInfo', JSON.stringify(res.data))
    })
  }
}
