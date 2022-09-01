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
  title: string = 'Nangular Chat - Login';
  email: string = '';
  password: string = '';
  storageEnabled: boolean = false;

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    public StorageService: StorageService
  ) {}

  ngOnInit() {
    //Check if already logged in
    if (sessionStorage.length > 0) {
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
    //Check Username & Password
    console.log('LOGINUSER INITIATED');
  }
}
