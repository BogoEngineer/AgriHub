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
  userId:Number;
  nurseryId: String;

  constructor(private http: HttpClient) { }

  fetchNurseries(id:Number): Observable<any>{
    this.userId = id;
    const url = `http://${this.host}/users/${id}/nurseries/`;
    const options = {
    }
    return this.http.get<Nursery[]>(url, options);
  }

  fetchSeedlings(idNur:String): Observable<any>{
    this.nurseryId = idNur;
    const url = `http://${this.host}/users/${this.userId}/nurseries/${idNur}`;
    return this.http.get<Seedling[]>(url, {});
  }

  change_state(value, state){
    const url = `http://${this.host}/users/${this.userId}/nurseries/${this.nurseryId}&${value}&${state}`;
    return this.http.put<any>(url, {});
  }
}
