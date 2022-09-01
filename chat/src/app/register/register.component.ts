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
  title: string = 'Nangular Chat - Register';
  email: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private StorageService: StorageService
  ) {}

  ngOnInit(): void {}

  registerUser() {
    //Register username as key, password as item
    localStorage.setItem(this.email, this.password);
    console.log(localStorage);
  }
}
