import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})

export class HttpService {

  groupUrl = "./data/groups"

  constructor(private httpClient: HttpClient) { }

  url = "http://localhost:3000";

  login(user: any) {
    return this.httpClient.post(this.url + "/api/auth", user, httpOptions);
  }

  sendGetRequest() {
    return this.httpClient.get(this.groupUrl);
  }
}
