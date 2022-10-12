import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../Services/storage.service';
import { from } from 'rxjs';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css'],
})
export class ProfilePageComponent implements OnInit {
  title = 'Profile';
  BACKEND_URL = 'http://localhost:3000';

  //Profile Info
  Username = localStorage.getItem('username');
  Email = localStorage.getItem('email');
  Role = localStorage.getItem('role');
  Password = localStorage.getItem('password');
  Age = localStorage.getItem('age');

  //Our edit form data
  save = {
    username: null,
    email: null,
    role: localStorage.getItem('role'), //Not making this editable from own profile page
    password: null,
    age: null,
  };

  constructor(
    private router: Router,
    private http: HttpClient,
    public StorageService: StorageService
  ) {}

  ngOnInit() {
    //Check if already logged in
    if (localStorage.getItem('username') == null) {
      alert('You are not logged in, redirecting you...');
      this.router.navigateByUrl('/login');
    }
  }

  logOut() {
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  saveChanges() {
    console.log('Changes Saved');
    const { email, role, age, username, password } = this.save;

    if (
      email != null &&
      role != null &&
      age != null &&
      username != null &&
      password != null
    ) {
      this.http
        .post(this.BACKEND_URL + '/api/login-after', {
          email: email,
          role: role,
          age: age,
          username: username,
          password: password,
        })
        .subscribe((data: any) => {
          if (data.valid == true) {
            alert('Information has been updated!');
            localStorage.setItem('username', username);
            localStorage.setItem('email', email);
            localStorage.setItem('role', role);
            localStorage.setItem('password', password);
            localStorage.setItem('age', age);
          } else if (data.valid == false) {
            alert('Information has been registered as a new user.');
            window.location.reload();
          }
        });
    }
  }
}
