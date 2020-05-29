import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  constructor(private http:HttpClient) { }

  getItems(){
    const url = `http://localhost:5000/users/5ea4af31fc2dc335d0dfc9e8/shop`
    return this.http.get<any>(url, {});
  }

  orderProducts(products:any[]){
    let idNur = JSON.parse(localStorage.getItem('nurseryInfo'))._id;
    const url=`http://localhost:5000/users/5ea4af31fc2dc335d0dfc9e8/shop/${idNur}`;
    return this.http.put(url, {data: products});
  }

  getProductSpecification(role){
    if(role == 'user'){
      let productInfo = JSON.parse(localStorage.getItem('productInfo'));
      const url=`http://localhost:5000/users/5ea4af31fc2dc335d0dfc9e8/shop/${productInfo.name}&${productInfo.company}`;
      return this.http.get<any>(url);
    }else {
      //let companyId = JSON.parse(localStorage.getItem('companyInfo'))._id;
      let companyId = '5ea57363b1801f3c649e2e7f';
      let productInfo = JSON.parse(localStorage.getItem('productInfo'));
      const url=`http://localhost:5000/companies/${companyId}/products/${productInfo.name}`;
      return this.http.get<any>(url);
    }

  }

  leaveReview(userInfo, body){
    let productInfo = JSON.parse(localStorage.getItem('productInfo'));
    const url = `http://localhost:5000/users/${userInfo._id}/shop/${productInfo.name}&${productInfo.company}/comment`;
    return this.http.put<any>(url, body);
  }
}
