import { Component, OnInit, Input } from '@angular/core';
import { WarehouseService } from '../../services/warehouse.service';
import { Product } from '../../models/product';
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.css']
})
export class WarehouseComponent implements OnInit {
  @Input() select_mode: string;
  seedling_view: boolean;
  products: Product[];
  og_products: Product[];
  orders: Product[];
  options: string = "sort";

  constructor(
    private warehouseService:WarehouseService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => { this.select_mode = params['select_mode'];});
    this.seedling_view = true;
    this.warehouseService.getProducts().subscribe(res => {
      this.products = res.data;
      this.og_products = res.data;
    });
    this.orders=[];
    this.warehouseService.getOrders().subscribe(res => {
      console.log(res);
      res.data.forEach(order => {
        this.orders.push(order);
      });
    });
  }

  change_view(view){
    this.seedling_view = view;
  }

  undo(){
    this.products = this.og_products;
  }

  apply() {
    let rg = document.getElementsByName('exampleRadios');
    let cond;
    rg.forEach(radio => {
      if((radio as HTMLInputElement).checked) cond = (radio as HTMLInputElement).value;
    });
    let f = (document.getElementById('exampleFormControlSelect1') as HTMLInputElement).value;
    let argument;
    if(f=="filter") argument = (document.getElementById('argument') as HTMLInputElement).value;
    switch(cond){
      case 'name':
        if(f=="filter"){
          this.products = this.products.filter(product=>{
            if(product.name==argument) return product;
          })
        }else {
          this.products = this.products.sort(
            (a, b)=>{
              return b.name.localeCompare(a.name);
            }
          );
        }
        break;
      case 'company':
        if(f=="filter"){
          this.products = this.products.filter(product=>{
            if(product.comp==argument) return product;
          })
        }else {
          this.products = this.products.sort((a, b)=>{
            return b.comp.localeCompare(a.comp);
          });
        }
        break;
      case 'quantity':
        if(f=="filter"){
          this.products = this.products.filter(product=>{
            if(product.quantity==parseInt(argument)) return product;
          })
        }else {
          this.products = this.products.sort((a, b)=>{
            return a.quantity-b.quantity;
          });
        }
        break;
    }
    console.log(this.products.sort())
  }

  useTreatment(name, company){
    this.warehouseService.useTreatment(name, company).subscribe()
    let find = this.products.filter(item=>{
      if(item.name == name || item.comp == company) return item;
    })[0];
    find.quantity -= 1;
    if(find.quantity==0) {
      let result = this.products.filter(item=>{
        if(JSON.stringify(find)!= JSON.stringify(item)) return item;
      });
      this.products = result;
      this.og_products = result;
    }

  }

  plantSeedling(name, company){
    this.warehouseService.plantSeedling(name, company).subscribe(res=>console.log(res));
  }

  cancelOrder(name, company){
    this.warehouseService.cancelOrder(name, company).subscribe(res=>console.log(res));
  }
}
