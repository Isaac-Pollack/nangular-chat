import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from '../Services/storage.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})

export class LoginPageComponent implements OnInit {
  BACKEND_URL = 'http://localhost:3000';
  storageEnabled: boolean = false;
  user: any = {};
  username = '';
  password:any = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    public StorageService: StorageService
  ) {}

  ngOnInit() {
    //Tests storage for validity
    if (typeof Storage !== 'undefined') {
      this.storageEnabled = true;
      console.log('Session Storage enabled: ' + this.storageEnabled);
      console.log(sessionStorage);
    } else {
      this.storageEnabled = false;
      console.log('Session Storage enabled: ' + this.storageEnabled);
    }

    //Debug
    console.log('Local Storage:');
    console.log(localStorage);
  }

  logInUser() {
    //Validate credentials
    this.user = this.validate(this.username, this.password);

    if (this.user != null) {
      this.http.post(this.BACKEND_URL + "/api/auth", JSON.stringify(this.user), httpOptions).subscribe((data: any) => {
        if (data.valid) {
          sessionStorage.setItem('username', data.username);
          this.http.get(this.BACKEND_URL + "/api/getUsers").subscribe((result: any) => {
            for (let i = 0; i < result.length; i++) {
              if (result[i].username == data.username) {
                sessionStorage.setItem('role', result[i].role);
                this.router.navigateByUrl('/profile');
              }
            }
          });
        }
        else {
          alert("Incorrect credentials");
        }
      });
    }
  }

    //Return details back or error
    validate(username: any, password: any) {

    var usernameValid = true;
    var passwordValid = true;
    var error: string = "";

    if (username.length > 0) { //check 1: username is not empty
      for (let i=0; i < username.length; i++) { //check 2: username does not contain spaces
        if (username.charAt(i) == " ") {
          usernameValid = false;
          error = "Credentials must not contain spaces";
        }
      }
    }
    else { usernameValid = false; error = "Credentials must not be blank"; }

    if (password != "") { // Can't be empty
    }
    else { passwordValid = false; error = "Password must not be blank"; }

    if (usernameValid && passwordValid) {
      return { username: username, password: password };
    }
    else {
      alert(error);
      return;
    }
  }

}
