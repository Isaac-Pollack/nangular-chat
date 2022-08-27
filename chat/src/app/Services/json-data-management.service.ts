import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

//Interfaces

@Injectable({
  providedIn: 'root'
})

export class JsonDataManagementService {

  url = '';
  jsonItems = {};

  constructor (private http:HttpClient) { }

  setItem(key, item){
    this.jsonItems[key] = item;
  }

  getItem(key){
    return this.jsonItems[key];
  }
}
