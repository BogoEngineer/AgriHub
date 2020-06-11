import { Component, OnInit } from '@angular/core';
import { NurseryService } from '../../services/nursery.service';
import { Router } from '@angular/router'

import { Nursery } from '../../models/nursery';
import { MatTooltip } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {
  user_id: any;
  nurseries: Nursery[];
  addview: boolean = false;
  
  maintnance: string;

  new_nursery: any= {
    name: "",
    place: "",
    width: "",
    height: ""
  }

  constructor(
    private nurseryService:NurseryService,
    private router:Router,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.maintnance= "";
    this.user_id = "5ea5606f9162bf6e70ec26cf" // test
    this.nurseryService.fetchNurseries(this.user_id).subscribe(response =>{
      this.nurseries = response.data;
      this.nurseries.forEach(nursery => {
        nursery.space = nursery.width * nursery.height;
        nursery.free_space = nursery.space - nursery.num_of_seedlings;
        if(nursery.water < 75 || nursery.temperature<12) {
          this.maintnance+= ' ' + nursery.name + ',';
        }
      });
      if(this.maintnance!=""){
        this.snackBar.open(`Nurseries${this.maintnance} need maintnance.`, "x", {
          horizontalPosition: "right",
          verticalPosition: "bottom"
        })
      }
    });
  }

  specifications(info: any){
    this.router.navigate([`user/nursery/dashboard`]);
    localStorage.setItem('nurseryInfo', JSON.stringify({
      _id: info._id,
      width: info.width,
      height: info.height,
      name: info.name,
      location: info.location,
      num_of_seedlings: info.num_of_seedlings,
      free_space: info.free_space,
      total_space: info.space,
      water: info.water,
      temperature: info.temperature
    }));
  }

  toggleView(){
    this.addview = !this.addview;
  }

  addNursery(){
    this.new_nursery.temperature = 18;
    this.new_nursery.water = 200;
    this.new_nursery.location = this.new_nursery.place;
    this.new_nursery.num_of_seedlings = 0;
    this.new_nursery.free_space = this.new_nursery.width * this.new_nursery.height;
    this.addview = false;
    this.nurseries.push(this.new_nursery);
    this.snackBar.open('New nursery has been added to your collection!', null, {
      duration:1500
    })
    this.nurseryService.addNursery(this.new_nursery).subscribe();
    this.new_nursery = {
      name: "",
      place: "",
      width: "",
      height: ""
    }
  }
}
