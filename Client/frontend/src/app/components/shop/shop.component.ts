import { Component, OnInit } from '@angular/core';
import { ShopService } from '../../services/shop.service'; 
import { Product } from '../../models/product';
import { Router } from '@angular/router';

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
    private router:Router) { }

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
    window.alert("Thank you for ordering!");
    if(this.shopping_items.length == 0) return;
    this.shopService.orderProducts(this.shopping_items).subscribe(res => {
      console.log(res);
    });
    location.reload();
  }

  getProductSpecification(product){
    localStorage.setItem('productInfo', JSON.stringify(product));
    this.router.navigate(['/user/nursery/shop/product']);
  }
}
