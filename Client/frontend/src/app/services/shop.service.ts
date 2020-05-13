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
}
