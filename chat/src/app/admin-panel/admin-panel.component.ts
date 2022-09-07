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
  usersData = {};
  BACKEND_URL = 'http://localhost:3000';
  htmlUserData = localStorage.getItem('All-User-Data');
  grouptoadd = '';

  constructor(
    private router: Router,
    public http: HttpClient,
    public StorageService: StorageService
  ) {}

  ngOnInit() {
    //Check if already logged in
    if (localStorage.getItem('username') == null) {
      alert('You are not logged in, redirecting you...');
      this.router.navigateByUrl('/login');
    }

    if (localStorage.getItem('All-User-Data') == null) {
      this.http
        .post<any>(this.BACKEND_URL + '/api/admin:all', {})
        .subscribe((data) => {
          var strData = JSON.stringify(data);
          console.log(strData);
          localStorage.setItem('All-User-Data', strData);
          location.reload();
        });
    }
  }

  deleteChannel() {
    console.log('delete working');
    localStorage.removeItem('test');
  }

  addChannel() {
    console.log('add working');
    //localStorage.setItem('test', 'test');
  }
}
