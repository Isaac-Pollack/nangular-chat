import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from '../Services/storage.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent implements OnInit {
  BACKEND_URL = 'http://localhost:3000';
  storageEnabled: boolean = false;
  email: string = '';
  password: String = '';
  role: string = '';
  error = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    public StorageService: StorageService
  ) {}

  ngOnInit() {
    //Check if already logged in
    if (localStorage.getItem('username') != null) {
      alert('You are already logged in, redirecting you...');
      this.router.navigateByUrl('/profile');
    }

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
    // Logs user to localstorage, ensures all fields are error-free & routes to /chat.
    console.log('Attempting to login...');
    this.http
      .post<any>(this.BACKEND_URL + '/api/login', {
        email: this.email,
        password: this.password,
      })
      .subscribe((data) => {
        if (data.fullMatch == true) {
          console.log('Login Successful');
          localStorage.setItem('username', data.username);
          localStorage.setItem('email', data.email);
          localStorage.setItem('role', data.role);
          localStorage.setItem('password', data.password);
          localStorage.setItem('age', data.age);
          this.router.navigateByUrl('/profile');
        } else {
          console.log('Login Unsuccessful');
        }
      });
  }
}
