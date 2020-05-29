import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  usermode:boolean;
  addview:boolean;

  companies: any[];
  users: any[];

  update_user: any;
  update_company: any;

  new_user  = {
    _id: '',
    first_name: '',
    last_name: '',
    username: '',
    password: '',
    email: '',
    place_of_birth: '',
    date_of_birth: '',
    phone: '',
    update: false
  };

  new_company = {
    _id: '',
    full_name: '',
    abbreviation: '',
    password: '',
    email: '',
    founding_date: '',
    place: '',
    update: false
  };

  constructor(
    private adminService:AdminService,
    private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.usermode = true;
    this.addview = false;
    this.adminService.getUsers().subscribe(res=>{
      this.users = res.data;
      this.users.forEach(user => {
        user.update = false;
      })
    })

    this.adminService.getCompanies().subscribe(res=>{
      this.companies = res.data;
      this.companies.forEach(company => {
        company.update = false;
      })
    })
  }

  toggleView(){
    this.addview = !this.addview;
    console.log(this.new_user);
  }

  toggleMode(){
    this.usermode = !this.usermode;
  }

  addUser(){
    this.adminService.addUser(this.new_user).subscribe(res=>{
      this.new_user._id = res.data._id;
      this.users.push(this.new_user);
      this.snackBar.open(`New user (${this.new_user.username}) has been added!`, null, {
        duration: 1500
      } )
      this.new_user  = {
        _id: '',
        first_name: '',
        last_name: '',
        username: '',
        password: '',
        email: '',
        place_of_birth: '',
        date_of_birth: '',
        phone: '',
        update: false
      };
    
    });
  }

  addCompany(){
    this.adminService.addCompany(this.new_company).subscribe(res=>{
      this.new_company._id = res.data._id;
      this.companies.push(this.new_company);
      this.snackBar.open(`New user (${this.new_company.abbreviation}) has been added!` , null, {
        duration: 1500
      })
      this.new_company = {
        _id: '',
        full_name: '',
        abbreviation: '',
        password: '',
        email: '',
        founding_date: '',
        place: '',
        update: false
      };
    
    });
  }

  updateUser(user){
    user.update = true;
    this.update_user = user;
  }

  updateCompany(company){
    company.update = true;
    this.update_company = company;
  }

  deleteUser(user){
    this.users = this.users.filter(u => {
      if(JSON.stringify(user)!=JSON.stringify(u)) return u;
    })
    if(user._id==null || user._id == undefined) return;
    this.adminService.deleteUser(user).subscribe(res=>{
      this.snackBar.open(`User (${user.username}) has been deleted!` , null, {
        duration: 1500
      })
    })
  }

  deleteCompany(company){
    this.companies = this.companies.filter(u => {
      if(JSON.stringify(company)!=JSON.stringify(u)) return u;
    })
    if(company._id==null || company._id == undefined) return;
    this.adminService.deleteCompany(company).subscribe(res=>{
      this.snackBar.open(`User (${company.abbreviation}) has been deleted!` , null, {
        duration: 1500
      })
    })
  }

  sendUser(user){
    user = this.update_user;
    user.update = false;
    this.adminService.updateUser(user).subscribe(res=>{
      this.snackBar.open(`User (${user.username}) has been updated!` , null, {
        duration: 1500
      })
    })
  }

  sendCompany(company){
    company = this.update_company;
    company.update = false;
    this.adminService.updateCompany(company).subscribe(res=>{
      this.snackBar.open(`User (${company.abbreviation}) has been updated!` , null, {
        duration: 1500
      })
    })
  }

}
