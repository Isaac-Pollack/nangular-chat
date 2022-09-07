import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from '../Services/storage.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  BACKEND_URL = 'http://localhost:3000';
  //Register Info
  Username = '';
  Email = '';
  Password = '';
  Age = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private StorageService: StorageService
  ) {}

  ngOnInit() {
    if (localStorage.getItem('username') != null) {
      alert('You are already registered, redirecting you...');
      this.router.navigateByUrl('/profile');
    }
  }

  registerUser() {
    //Check if there is a user with the email already, if so, deny req. Else register to JSON file

    console.log('Attempting to register...');
    this.http
      .post<any>(this.BACKEND_URL + '/api/register', {
        email: this.Email,
        role: 'Default',
        age: this.Age,
        username: this.Username,
        password: this.Password,
      })
      .subscribe((data) => {
        if (data.fullMatch == false) {
          console.log('Register Successful');
          //Clear storage to ensure no lingering data
          sessionStorage.clear();
          localStorage.clear();

          //Set localdata and API will save to JSON on server side
          localStorage.setItem('username', data.username);
          localStorage.setItem('email', data.email);
          localStorage.setItem('role', data.role);
          localStorage.setItem('password', data.password);
          localStorage.setItem('age', data.age);
          this.router.navigateByUrl('/profile');
        } else {
          console.log('Register Unsuccessful');
          alert('A user account already exists with this email!');
        }
      });
  }
}
