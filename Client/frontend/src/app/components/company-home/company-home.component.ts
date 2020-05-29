import { Component, OnInit } from '@angular/core';
import { Order } from '../../models/order';

import { CompanyService } from '../../services/company.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltip } from '@angular/material/tooltip';


@Component({
  selector: 'app-company-home',
  templateUrl: './company-home.component.html',
  styleUrls: ['./company-home.component.css']
})
export class CompanyHomeComponent implements OnInit {
  orders: Order[];
  company: any;

  constructor(
    private companyService:CompanyService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    //this.company = JSON.parse(localStorage.getItem('companyInfo'));
    this.company = {
      postman: 5,
      _id: '5ea57363b1801f3c649e2e7f'
    } //dummy
    this.companyService.getOrders().subscribe(res => {
      this.orders = res.data;
      this.orders.forEach(order => {
        order.date = new Date(order.date)
      });
      this.orders.sort((a,b)=>{
        return a.status.localeCompare(b.status);
      })
    });
  }

  acceptOrder(order){
    //ne treba provera na klijentskoj strani moze i server too
    localStorage.setItem('orderInfo', JSON.stringify(order));
    this.companyService.handleOrder('accept').subscribe(res=>{
      this.orders = this.orders.filter(ord=>{
        if(JSON.stringify(ord)!=JSON.stringify(order)) return ord;
      })  
      if(res.success == false){
        this.snackBar.open('There is no postman available!', null, {
          duration: 2000
        });
        this.orders.unshift(order);
        order.status ='high priority';
      }else{
        this.snackBar.open('The order has been accepted!', null, {
          duration: 2000
        });
      }

    });



  }

  declineOrder(order){
    this.orders = this.orders.filter(ord=>{
      if(JSON.stringify(ord)!=JSON.stringify(order)) return ord;
    })
    localStorage.setItem('orderInfo', JSON.stringify(order));
    this.companyService.handleOrder('decline').subscribe();
    this.snackBar.open('The order has been declined!', null,{
      duration: 2000
    });
  }
}
