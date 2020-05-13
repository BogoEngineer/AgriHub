import { Component, OnInit } from '@angular/core';
import { ShopService } from '../../services/shop.service'; 
import { Product } from '../../models/product';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  products: Product[];

  constructor(private shopService:ShopService) { }

  ngOnInit(): void {
    this.shopService.getItems().subscribe(response=>{
      this.products = response.data;
    })
  }

}
