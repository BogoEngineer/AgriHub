import { Component, OnInit, Input } from '@angular/core';
import {FormBuilder, FormGroup, Validators, ControlContainer} from '@angular/forms';

import { Router } from '@angular/router';

import { Product } from '../../models/product';
import { CompanyService } from '../../services/company.service';

import { MatTooltip } from '@angular/material/tooltip';
import { MatStepper } from '@angular/material/stepper';
import { MatButton } from '@angular/material/button';
import { MatSelect } from '@angular/material/select';
import { MAT_SELECT_SCROLL_STRATEGY } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-my-products',
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.css']
})
export class MyProductsComponent implements OnInit {
  my_products: Product[];

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(
    private companyService:CompanyService,
    private router:Router,
    private _formBuilder:FormBuilder,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      nameCtrl: ['', Validators.required],
      typeCtrl: ['', Validators.required],
      quantityCtrl: ['', Validators.required],
      priceCtrl: ['', Validators.required]
    });
    this.companyService.getMyProducts().subscribe(res=>{
      this.my_products = res.data;
    })
  }

  getProductSpecification(product){
    localStorage.setItem('productInfo', JSON.stringify(product));
    this.router.navigate(['/company/shop/product', {role:'company'}]);
  }

  deleteProduct(product){
    this.my_products = this.my_products.filter(prod => {
      if(JSON.stringify(product) != JSON.stringify(prod)) return prod;
    })
    //this.companyService.deleteProduct(product).subscribe();
  }

  addProduct(){
    let request = {
      name: this.firstFormGroup.controls['nameCtrl'].value,
      type: this.firstFormGroup.controls['typeCtrl'].value,
      quantity: this.firstFormGroup.controls['quantityCtrl'].value,
      price: this.firstFormGroup.controls['priceCtrl'].value,
      id: ''
    }
    

    if(request.name != '' && request.type!= '' && request.quantity!= '' && request.price!=''){
      this.companyService.addProduct(request).subscribe(res=>{
        this.my_products.push(request as unknown as Product);
      });
    }else{
      this.snackBar.open("Please fill all fields!", null, {
        duration: 1500});
    }
  }
}
