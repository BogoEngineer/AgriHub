import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  host: number = 5000;
  constructor(private http: HttpClient) { }

  getOrders(){
    //let companyId = JSON.parse(localStorage.getItem('companyInfo'))._id;
    let companyId = '5ea57363b1801f3c649e2e7f';
    const url = `http://localhost:${this.host}/companies/${companyId}`;
    return this.http.get<any>(url);
  }

  handleOrder(outcome){
    //let companyId = JSON.parse(localStorage.getItem('companyInfo'))._id;
    let companyId = '5ea57363b1801f3c649e2e7f';
    let order = JSON.parse(localStorage.getItem('orderInfo'));
    const url = `http://localhost:${this.host}/companies/${companyId}/orders/handle`;
    return this.http.post<any>(url, {data: {
      order: order,
      outcome: outcome,
      company: companyId
    }});
  }

  getMyProducts(){
    //let companyId = JSON.parse(localStorage.getItem('companyInfo'))._id;
    let companyId = '5ea57363b1801f3c649e2e7f';
    const url = `http://localhost:${this.host}/companies/${companyId}/products`;
    return this.http.get<any>(url);
  }

  deleteProduct(product){
    //let companyId = JSON.parse(localStorage.getItem('companyInfo'))._id;
    let companyId = '5ea57363b1801f3c649e2e7f';
    const url = `http://localhost:${this.host}/companies/${companyId}/products/${product.name}`;
    return this.http.delete(url);
  }

  addProduct(request){
    //let companyId = JSON.parse(localStorage.getItem('companyInfo'))._id;
    let companyId = '5ea57363b1801f3c649e2e7f';
    request.id = companyId;
    const url = `http://localhost:${this.host}/companies/${companyId}/products`;
    return this.http.put<any>(url, request);
  }

  getData(){
    //let companyId = JSON.parse(localStorage.getItem('companyInfo'))._id;
    let companyId = '5ea57363b1801f3c649e2e7f';
    const url = `http://localhost:${this.host}/companies/${companyId}/chart`;
    return this.http.get<any>(url);
  }
}
