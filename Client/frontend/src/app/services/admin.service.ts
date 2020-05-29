import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  host:number = 5000;
  constructor(private http:HttpClient) { }

  getUserRequests(){
    const url = `http://localhost:${this.host}/admin/requests/user`;
    return this.http.get<any>(url);
  }

  getCompanyRequests(){
    const url = `http://localhost:${this.host}/admin/requests/company`;
    return this.http.get<any>(url);
  }

  createRequest(data){
    const url = `http://localhost:${this.host}/admin/requests/company`;
    return this.http.put<any>(url, data);
  }

  handleRequest(data, decision){
    const url = `http://localhost:${this.host}/admin/requests/${decision}`;
    return this.http.post<any>(url, data);
  }

  getUsers(){
    const url = `http://localhost:${this.host}/admin/users`;
    return this.http.get<any>(url);
  }

  getCompanies(){
    const url = `http://localhost:${this.host}/admin/companies`;
    return this.http.get<any>(url);
  }

  addUser(new_user){
    delete new_user._id;
    const url = `http://localhost:${this.host}/admin/users`;
    return this.http.put<any>(url, new_user);
  }

  addCompany(new_company){
    delete new_company._id;
    const url = `http://localhost:${this.host}/admin/companies`;
    return this.http.put<any>(url, new_company);
  }

  deleteUser(user){
    const url = `http://localhost:${this.host}/admin/users/${user._id}`;
    return this.http.delete<any>(url);
  }

  deleteCompany(company){
    const url = `http://localhost:${this.host}/admin/companies/${company._id}`;
    return this.http.delete<any>(url);
  }

  updateUser(user){
    const url = `http://localhost:${this.host}/admin/users/${user._id}`;
    return this.http.post<any>(url, user);
  }

  updateCompany(company){
    const url = `http://localhost:${this.host}/admin/companies/${company._id}`;
    return this.http.post<any>(url, company);
  }
}
