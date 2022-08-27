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
  storageEnabled = false;
  userAccount = {username: this.email, password: this.password};

  constructor(private router: Router, private httpClient: HttpClient, private JsonDataManagementService: JsonDataManagementService){ }

  ngOnInit() { //DOM is Ready > action

    //sessionStorage.setItem("username", 'Isaac')
    //testing session storage redirect

    //Check if already logged in
    if(sessionStorage.getItem("username") != null) {
      alert("You are already logged in, redirecting you...");
      this.router.navigateByUrl('/profile');
    }

    //Tests storage for validity
    if (typeof(Storage) !== "undefined"){
      this.storageEnabled = true;
    } else {
      this.storageEnabled = false;
    }

    //Debug
    console.log('Session Storage enabled: ' + this.storageEnabled);
    console.log(sessionStorage);
    console.log(localStorage);
  }

  logInUser() {
    //super@test.com
    if (this.email == "super@test.com"){
      if(this.password == "test"){
        this.router.navigateByUrl("/profile");
      }
    }

    //admin@test.com
    else if (this.email == "admin@test.com"){
      if(this.password == "test"){
        this.router.navigateByUrl("/profile");
      }
    }

    //user@test.com
    else if (this.email == "user@test.com"){
      if(this.password == "test"){
        this.router.navigateByUrl("/profile");
      }
    }
    else{ window.alert("Username or password is not valid!"); }
  }
}
