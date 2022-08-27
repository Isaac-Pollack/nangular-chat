import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JsonDataManagementService } from '../Services/json-data-management.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})

export class LoginPageComponent implements OnInit {

  title = 'Nangular Chat - Login';
  email = '';
  password = '';
  userAccount = {username: this.email, password: this.password};

  constructor(private router: Router, private httpClient: HttpClient, private JsonDataManagementService: JsonDataManagementService){ }

  ngOnInit() { //DOM is Ready > action

    //Tests both local Storage and sessionStorage is available. Some older browsers may not support these methods.
    if (typeof(Storage) !== "undefined"){
      console.log('Session Storage Ready');
    } else {
      console.log('No Session Storage Support');
    }

    //Debug
    console.log(sessionStorage);
    console.log(localStorage);
  }

  setItem() {
    this.JsonDataManagementService.setItem(this.email, this.password);
    console.log(this.JsonDataManagementService.jsonItems);
  }
}
