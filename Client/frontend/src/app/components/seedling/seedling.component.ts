import { Component, OnInit, Input } from '@angular/core';

import { Seedling } from '../../models/seedling'

@Component({
  selector: 'app-seedling',
  templateUrl: './seedling.component.html',
  styleUrls: ['./seedling.component.css']
})
export class SeedlingComponent implements OnInit {

  @Input() seedling:Seedling;

  constructor() { }

  ngOnInit(): void {
  }

  

}
