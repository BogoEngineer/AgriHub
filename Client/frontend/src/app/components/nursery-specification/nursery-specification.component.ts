import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { NurseryService } from '../../services/nursery.service'
import { Seedling } from 'src/app/models/Seedling';

@Component({
  selector: 'app-nursery-specification',
  templateUrl: './nursery-specification.component.html',
  styleUrls: ['./nursery-specification.component.css']
})
export class NurserySpecificationComponent implements OnInit {
  nurseryInfo:any;
  seedlings: Seedling[];
  numbersWidth: any; // helper for ngFor
  numbersHeight: any; // same

  show_seedling_specification: number;
  show_additional_info: boolean;
  showNursery: boolean;

  constructor(
    private nurseryService:NurseryService,
    private router: Router) { }

  ngOnInit(): void {
    this.showNursery = false;
    this.show_additional_info = false;
    this.show_seedling_specification = -1;
    this.nurseryInfo = JSON.parse(localStorage.getItem('nurseryInfo'));
    this.numbersWidth = this.numbersWidth = Array(this.nurseryInfo.width).fill(0).map((x,i)=>i);
    this.numbersHeight = this.numbersHeight = Array(this.nurseryInfo.height).fill(0).map((x,i)=>i);
    this.seedlings = new Array<Seedling>(this.nurseryInfo.width*this.nurseryInfo.height);
    this.nurseryService.fetchSeedlings(this.nurseryInfo._id).subscribe(response => {
      let temp = response.data;
      temp.forEach(seedling => {
        this.seedlings[seedling.position] = seedling;
      });
    });
  }

  getSeedlingSpecification(seedling:any){
    if(seedling != null){
      this.show_seedling_specification = seedling.position;
    }
  }

  stopSeedlingSpecification(seedling:any){
    this.show_seedling_specification = -1;
  }

  toggle(){
    this.show_additional_info = !this.show_additional_info;
  }

  toggleView(){
    this.showNursery= !this.showNursery;
  }

  change_state(value, state){
    if(state=="water"){
      this.nurseryInfo.water += value;
    }
    if(state=="temperature"){
      this.nurseryInfo.temperature += value;
    }
    this.nurseryService.change_state(value, state).subscribe(response=>{
    });
  }

  treat(seedling){
    if(seedling.progress < 100) localStorage.setItem('seedlingInfo', JSON.stringify(seedling));
    if(seedling.progress >= 100){
      this.nurseryService.removeSeedling(seedling).subscribe();
    }
    //this.router.navigate(['user/nursery/dashboard']);
    location.reload();
  }

  plant(position){
    localStorage.setItem('position', position);
  }
}
