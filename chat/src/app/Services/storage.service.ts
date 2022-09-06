import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, retry } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  BACKEND_URL = 'http://localhost:3000';
  jsonItems = {};

  constructor(private http: HttpClient) {}

  NgOnInit() {}

  setItem(key, item) {
    this.jsonItems[key] = item;
  }

  getItem(key) {
    return this.jsonItems[key];
  }
}
