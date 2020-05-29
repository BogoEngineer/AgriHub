import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {
  users_mode: boolean;
  company_requests: any[];
  user_requests: any[];
  constructor(
    private adminService:AdminService,
    private snackBar:MatSnackBar) { }

  ngOnInit(): void {
    this.users_mode = true;
    this.adminService.getUserRequests().subscribe(res=>{
      this.user_requests = res.data;
      this.user_requests.forEach(request => {
        request.date_of_birth = new Date(request.date_of_birth);
      });
    })
    this.adminService.getCompanyRequests().subscribe(res=>{
      this.company_requests = res.data;
      this.company_requests.forEach(request => {
        request.founding_date = new Date(request.founding_date);
      });
    })
  }
  acceptRequest(request){
    this.adminService.handleRequest(request, 'accept').subscribe();
    if(request.type == 'user'){
      this.user_requests=this.user_requests.filter(req=>{
        if(JSON.stringify(request)!=JSON.stringify(req)) return req;
      })
    }else{
      this.company_requests=this.company_requests.filter(req=>{
        if(JSON.stringify(request)!=JSON.stringify(req)) return req;
      })
    }
    this.snackBar.open("You have accepted request!", null, {
      duration: 1500
    })
  }
  declineRequest(request){
    this.adminService.handleRequest(request, 'decline').subscribe();
    if(request.type == 'user'){
      this.user_requests=this.user_requests.filter(req=>{
        if(JSON.stringify(request)!=JSON.stringify(req)) return req;
      })
    }else{
      this.company_requests=this.company_requests.filter(req=>{
        if(JSON.stringify(request)!=JSON.stringify(req)) return req;
      })
    }
    this.snackBar.open("You have declined request!", null, {
      duration: 1500
    })
  }

  toggle(){
    this.users_mode = !this.users_mode;
  }
}
