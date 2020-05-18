import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { htmlAstToRender3Ast } from '@angular/compiler/src/render3/r3_template_transform';


@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  constructor(private http:HttpClient) { }

  getProducts(){
    let idNur = JSON.parse(localStorage.getItem('nurseryInfo'))._id;
    const url = `http://localhost:5000/users/5ea4af31fc2dc335d0dfc9e8/nurseries/${idNur}/warehouse`;
    return this.http.get<any>(url, {});
  }

  getOrders(){
    let idNur = JSON.parse(localStorage.getItem('nurseryInfo'))._id;
    const url = `http://localhost:5000/users/5ea4af31fc2dc335d0dfc9e8/nurseries/${idNur}/warehouse/orders`;
    return this.http.get<any>(url, {});
  }

  useTreatment(name, company){
    let seedling = JSON.parse(localStorage.getItem('seedlingInfo'));
    let nursery = JSON.parse(localStorage.getItem('nurseryInfo'));
    const url = `http://localhost:5000/users/5ea4af31fc2dc335d0dfc9e8/seedlings/treat`;
    let data = {
      tr_name: name,
      tr_company: company,
      sd_name: seedling.name,
      sd_company: seedling.company._id,
      sd_position: seedling.position,
      nur_id: nursery._id
    }
    return this.http.put(url, {data: data});
  }

  plantSeedling(name, company){
    let position = localStorage.getItem('position');
    let nursery = JSON.parse(localStorage.getItem('nurseryInfo'));
    const url = `http://localhost:5000/users/5ea4af31fc2dc335d0dfc9e8/seedlings/manage`;
    let data = {
      company: company,
      name: name,
      nursery: nursery._id,
      position: position,
    }
    return this.http.put(url, {data: data});
  }

  cancelOrder(name, company){
    let idNur = JSON.parse(localStorage.getItem('nurseryInfo'))._id;
    const url = `http://localhost:5000/users/5ea4af31fc2dc335d0dfc9e8/nurseries/${idNur}/warehouse/orders/${name}&${company}`;
    return this.http.delete(url);
  }
}
