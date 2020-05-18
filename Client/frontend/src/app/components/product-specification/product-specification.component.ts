import { Component, OnInit } from '@angular/core';
import { ShopService } from '../../services/shop.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-specification',
  templateUrl: './product-specification.component.html',
  styleUrls: ['./product-specification.component.css']
})
export class ProductSpecificationComponent implements OnInit {
  product: Product;
  reviews: any[];
  show:boolean = false;

  new_review: any = {
    user: null,
    rating: 3,
    comment: ""
  };

  constructor(private shopService:ShopService) { }

  ngOnInit(): void {
    this.product = JSON.parse(localStorage.getItem('productInfo'));
    this.shopService.getProductSpecification().subscribe(response =>{
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
      window.alert("This user already commented on this product!");
      return;
    }

    this.shopService.leaveReview(userInfo, {rating: this.new_review.rating, comment:this.new_review.comment}).subscribe(res=>{  
      if(res.success==true){
        this.new_review.user = userInfo.username;
        window.alert("Thank you for leaving a comment!");
        this.reviews.push(this.new_review);
        
        // updating average rating of product on client side
        this.product.average_rating = (this.product.average_rating*(this.reviews.length-1) + this.new_review.rating)/(this.reviews.length);
        localStorage.setItem('productInfo', JSON.stringify(this.product));
        return;
      }
      window.alert(res.explanation);
    });

  }
}
