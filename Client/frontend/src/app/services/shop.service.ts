import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  constructor(private http:HttpClient) { }

  getItems(){
    let userId = JSON.parse(localStorage.getItem('userInfo'))._id;
    const url = `http://localhost:5000/users/${userId}/shop`
    return this.http.get<any>(url, {});
  }

  orderProducts(products:any[]){
    let idNur = JSON.parse(localStorage.getItem('nurseryInfo'))._id;
    let userId = JSON.parse(localStorage.getItem('userInfo'))._id;
    const url=`http://localhost:5000/users/${userId}/shop/${idNur}`;
    return this.http.put(url, {data: products});
  }

  getProductSpecification(role){
    let userId = JSON.parse(localStorage.getItem('userInfo'))._id;
    if(role == 'user'){
      let productInfo = JSON.parse(localStorage.getItem('productInfo'));
      const url=`http://localhost:5000/users/${userId}/shop/${productInfo.name}&${productInfo.company}`;
      return this.http.get<any>(url);
    }else {
      let productInfo = JSON.parse(localStorage.getItem('productInfo'));
      const url=`http://localhost:5000/companies/${userId}/products/${productInfo.name}`;
      return this.http.get<any>(url);
    }

  }

  leaveReview(userInfo, body){
    let productInfo = JSON.parse(localStorage.getItem('productInfo'));
    const url = `http://localhost:5000/users/${userInfo._id}/shop/${productInfo.name}&${productInfo.company}/comment`;
    return this.http.put<any>(url, body);
  }
}
