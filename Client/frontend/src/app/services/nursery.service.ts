import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { of } from 'rxjs'

import { Nursery } from '../models/Nursery';
import { Seedling } from '../models/Seedling';

@Injectable({
  providedIn: 'root'
})
export class NurseryService {

  host:String = 'localhost:5000';
  nurseryId: String;

  constructor(private http: HttpClient) { }

  fetchNurseries(id:Number): Observable<any>{
    let userId = JSON.parse(localStorage.getItem('userInfo'))._id;
    const url = `http://${this.host}/users/${userId}/nurseries/`;
    const options = {
    }
    return this.http.get<Nursery[]>(url, options);
  }

  fetchSeedlings(idNur:String): Observable<any>{
    let userId = JSON.parse(localStorage.getItem('userInfo'))._id;
    this.nurseryId = idNur;
    const url = `http://${this.host}/users/${userId}/nurseries/${idNur}`;
    return this.http.get<Seedling[]>(url, {});
  }

  change_state(value, state){
    let userId = JSON.parse(localStorage.getItem('userInfo'))._id;
    const url = `http://${this.host}/users/${userId}/nurseries/${this.nurseryId}&${value}&${state}`;
    return this.http.put<any>(url, {});
  }

  removeSeedling(seedling){
    const idNur = JSON.parse(localStorage.getItem('nurseryInfo'))._id;
    let userId = JSON.parse(localStorage.getItem('userInfo'))._id;
    const url = `http://${this.host}/users/${userId}/nurseries/${idNur}/seedlings/${seedling._id}`;
    return this.http.delete(url);
  }

  addNursery(nursery){
    let userId = JSON.parse(localStorage.getItem('userInfo'))._id;
    const url = `http://${this.host}/users/${userId}/nurseries/`;
    return this.http.put<any>(url, {
      name: nursery.name,
      location: nursery. place,
      width: nursery.width,
      height: nursery.height
    });
  }
}
