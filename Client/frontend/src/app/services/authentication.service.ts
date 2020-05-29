import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { local } from 'd3';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  host: string = '5000';

  constructor(
    private http: HttpClient
  ) { }

  logIn(username, password, role){
    const url = `http://localhost:${this.host}/admin/login/${role}`;
    return this.http.post<any>(url, {username: username, password: password});
  }

  isLoggedIn(){
    let user = localStorage.getItem('userInfo');
    if(user == null) return false;
    return true;
  }

  changePassword(new_password){
    let user = JSON.parse(localStorage.getItem('userInfo')); 
    const url = `http://localhost:${this.host}/admin/change-password/${new_password}`;
    return this.http.post<any>(url, user);
  }
}
