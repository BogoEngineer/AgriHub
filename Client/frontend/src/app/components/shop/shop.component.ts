import { Component, OnInit } from '@angular/core';
import { ShopService } from '../../services/shop.service'; 
import { Product } from '../../models/product';
import { Router } from '@angular/router';

import { MatTooltipModule} from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  products: Product[];
  stars: any;
  shopping_items: any[];

  constructor(
    private shopService:ShopService,
    private router:Router,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.shopping_items = []
    this.stars= Array(5).fill(0).map((x,i)=>i);
    this.shopService.getItems().subscribe(response=>{
      this.products = response.data;
    })
  }

  changeList(item){
    let s = `${item.name}${item.comp}` + "num"
    let num = document.getElementById(s) as HTMLInputElement;
    item.number = num.value;
    let str = `${item.name}${item.comp}`
    let checkBox = document.getElementById(str) as HTMLInputElement;
    if(checkBox.checked == true){
      this.shopping_items.push(item);
    }else if(checkBox.checked == false){
      this.shopping_items = this.shopping_items.filter(it=>{
        if(item.name !== it.name || item.comp !== it.comp){
          return it;
        }
      });
    }
  }

  buyProducts(){
    if(this.shopping_items.length == 0) return;
    this.snackBar.open("Thank you for ordering!", null, {
      duration: 2000
    });
    this.shopService.orderProducts(this.shopping_items).subscribe(res => {
      console.log(res);
    });
    setTimeout(window.location.reload.bind(window.location), 2000);
  }

  getProductSpecification(product){
    localStorage.setItem('productInfo', JSON.stringify(product));
    this.router.navigate(['/user/nursery/shop/product', {role:'user'}]);
  }
}
