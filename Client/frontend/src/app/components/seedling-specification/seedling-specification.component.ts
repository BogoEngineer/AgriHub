import { Component, OnInit, Input } from '@angular/core';
import { Seedling } from '../../models/seedling';

@Component({
  selector: 'app-seedling-specification',
  templateUrl: './seedling-specification.component.html',
  styleUrls: ['./seedling-specification.component.css']
})
export class SeedlingSpecificationComponent implements OnInit {

  @Input() seedling:Seedling;

  constructor() { }

  ngOnInit(): void {
  }

}
