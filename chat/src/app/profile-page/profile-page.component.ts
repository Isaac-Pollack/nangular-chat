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
  Username = capitalizeFirstLetter(localStorage.getItem('username'));
  Role = localStorage.getItem('role');
  Email = localStorage.getItem('email');

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
    } else {
      this.fetchProfile();
    }
  }

  fetchProfile() {
    console.log('Fetching Profile...');

    let profileEmail = localStorage.getItem('username');
    console.log('Logged in as: ' + profileEmail);

    //Request profile info if not already filled.
    if (localStorage.getItem('role') == null) {
      this.http
        .post<any>(this.BACKEND_URL + '/api/profile', {
          email: profileEmail,
        })
        .subscribe((data) => {
          console.log(data);
          localStorage.setItem('email', data.email);
          localStorage.setItem('role', data.role);
          localStorage.setItem('username', data.username);
          localStorage.setItem('userid', data.userid);
        });
    }
  }

  logOut() {
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
