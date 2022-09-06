import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from '../Services/storage.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
})
export class AdminPanelComponent implements OnInit {
  title = 'Admin Panel';
  BACKEND_URL = 'http://localhost:3000';

  constructor(
    private router: Router,
    private http: HttpClient,
    public StorageService: StorageService
  ) {}

  async ngOnInit() {
    //Check if already logged in
    if (localStorage.getItem('username') == null) {
      alert('You are not already logged in, redirecting you...');
      this.router.navigateByUrl('/login');
    }

    //Load Users.JSON
    const dataDump = fetch(this.BACKEND_URL + '/api/users')
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        let userData = JSON.stringify(myJson.Users);
        console.log(userData);
        return userData;
      });
  }
}
