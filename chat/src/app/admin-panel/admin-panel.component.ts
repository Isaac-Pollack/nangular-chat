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
    public http: HttpClient,
    public StorageService: StorageService
  ) {}

  userData: any;
  a_username = null;
  a_password = null;
  a_age = null;
  a_email = null;
  a_role = null;

  ngOnInit() {
    if (localStorage.getItem('username') == null) {
      alert('You are not logged in, redirecting you...');
      this.router.navigateByUrl('/login');
    } else {
      this.getUser();
    }
  }

  public getUser() {
    this.http
      .post(this.BACKEND_URL + '/api/get-users', 'dummy req')
      .subscribe((data: any) => {
        this.userData = data.userValues.Users;
      });
  }

  public addUser() {
    this.http
      .post(this.BACKEND_URL + '/api/add-user', {
        password: this.a_password,
        username: this.a_username,
        email: this.a_email,
        age: this.a_age,
        role: this.a_role,
      })
      .subscribe((data: any) => {
        if (data.valid == false) {
          alert('This user already exists');
        } else if (data.valid == true) {
          alert('Added user!');
          window.location.reload();
        }
      });
  }

  public removeUser(username: string) {
    this.http
      .post(this.BACKEND_URL + '/api/delete-user', { username: username })
      .subscribe((data: any) => {
        if (data.valid) {
          alert('User Deleted');
        }
        window.location.reload();
      });
  }
}
