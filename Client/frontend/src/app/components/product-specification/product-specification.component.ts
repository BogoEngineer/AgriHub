import { Component, OnInit, Input } from '@angular/core';
import { ShopService } from '../../services/shop.service';
import { Product } from '../../models/product';
import { ActivatedRoute } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-specification',
  templateUrl: './product-specification.component.html',
  styleUrls: ['./product-specification.component.css']
})
export class ProductSpecificationComponent implements OnInit {
  @Input() role:string;
  product: Product;
  reviews: any[];
  show:boolean = false;

  new_review: any = {
    user: null,
    rating: 3,
    comment: ""
  };

  constructor(
    private shopService:ShopService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => { this.role = params['role'];});
    this.product = JSON.parse(localStorage.getItem('productInfo'));
    this.shopService.getProductSpecification(this.role).subscribe(response =>{
      this.reviews = response.data;
    });
  }

  hideReview(review){
    review.hide = true;
  }

  toggle(){
    this.show = !this.show;
  }

  leaveReview(){
    //let userInfo = JSON.parse(localStorage.getItem('userInfo')); 
    let userInfo= {
      username: 'per',
      _id: '5ea4af31fc2dc335d0dfc9e8'
    }; //dummy
    let approval = true;
    this.reviews.forEach(review => {
      if(review.user == userInfo.username){
        approval = false;
      }
    });
  
    if(!approval) {
      this.snackBar.open("This user already commented on this product!", null, {
        duration: 1500
      });
      return;
    }

    this.shopService.leaveReview(userInfo, {rating: this.new_review.rating, comment:this.new_review.comment}).subscribe(res=>{ 
      console.log(res); 
      if(res.success==true){
        this.new_review.user = userInfo.username;
        this.snackBar.open("Thank you for leaving a comment!", null, {
          duration: 1500
        });
        this.reviews.push(this.new_review);
        
        // updating average rating of product on client side
        this.product.average_rating = (this.product.average_rating*(this.reviews.length-1) + this.new_review.rating)/(this.reviews.length);
        localStorage.setItem('productInfo', JSON.stringify(this.product));
        return;
      }
      this.snackBar.open("This user hasn't ordered this product yet!", null, {
        duration: 1500
      });
    });

  }
}
