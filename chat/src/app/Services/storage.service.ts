import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  username: String;
  role: String;
  valid: boolean;
}

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

  login(inputUsername: string, inputPassword: string) {
    return this.http.post<User>(this.BACKEND_URL + '/api/login', {
      inputUsername,
      inputPassword,
    });
  }
}
