import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  host: number = 5000;
  api_key: string = 'ArS_QnNxvaihoDPoL6zN1DZxX9oefwSb4cQVuYfyy-_7uqCodBt6uFBGPEaOjdJG';


  constructor(private http: HttpClient) { }

  getOrders(){
    let companyId = JSON.parse(localStorage.getItem('userInfo'))._id;
    const url = `http://localhost:${this.host}/companies/${companyId}`;
    return this.http.get<any>(url);
  }

  handleOrder(outcome){
    let companyId = JSON.parse(localStorage.getItem('userInfo'))._id;
    let order = JSON.parse(localStorage.getItem('orderInfo'));
    const url = `http://localhost:${this.host}/companies/${companyId}/orders/handle`;
    return this.http.post<any>(url, {data: {
      order: order,
      outcome: outcome,
      company: companyId
    }});
  }

  getMyProducts(){
    let companyId = JSON.parse(localStorage.getItem('userInfo'))._id;
    const url = `http://localhost:${this.host}/companies/${companyId}/products`;
    return this.http.get<any>(url);
  }

  deleteProduct(product){
    let companyId = JSON.parse(localStorage.getItem('userInfo'))._id;
    const url = `http://localhost:${this.host}/companies/${companyId}/products/${product.name}`;
    return this.http.delete(url);
  }

  addProduct(request){
    let companyId = JSON.parse(localStorage.getItem('userInfo'))._id;
    request.id = companyId;
    const url = `http://localhost:${this.host}/companies/${companyId}/products`;
    return this.http.put<any>(url, request);
  }

  getData(){
    let companyId = JSON.parse(localStorage.getItem('userInfo'))._id;
    const url = `http://localhost:${this.host}/companies/${companyId}/chart`;
    return this.http.get<any>(url);
  }
}
