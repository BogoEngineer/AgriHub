import { Component, OnInit } from '@angular/core';
import { NurseryService } from '../../services/nursery.service';
import { Router } from '@angular/router'

import { Nursery } from '../../models/nursery';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {
  user_id: any;
  nurseries: Nursery[];
  add_view: boolean = false;

  new_nursery: Nursery= {
    name: "",
    place: "",
    width: "",
    height: ""
  }

  constructor(
    private nurseryService:NurseryService,
    private router:Router) { }

  ngOnInit(): void {
    this.user_id = "5ea5606f9162bf6e70ec26cf" // test
    this.nurseryService.fetchNurseries(this.user_id).subscribe(response =>{
      this.nurseries = response.data;
      this.nurseries.forEach(nursery => {
        nursery.space = nursery.width * nursery.height;
        nursery.free_space = nursery.space - nursery.num_of_seedlings;
      });
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
    this.add_view = !this.add_view;
  }

  addNursery(){
    this.nurseryService.addNursery(this.new_nursery).subscribe();
    this.new_nursery.temperature = 18;
    this.new_nursery.water = 200;
    this.new_nursery.location = this.new_nursery.space;
    this.new_nursery.num_of_seedlings = 0;
    this.new_nursery.free_space = this.new_nursery.width * this.new_nursery.height;
    this.add_view = false;
    this.nurseries.push(this.new_nursery);
  }
}
