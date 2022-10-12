import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'NANGULAR CHAT';
  Auth = false;

  constructor(private router: Router) {
    if (sessionStorage.getItem('username') != undefined) {
      this.Auth = true;
    }
  }

  // CHeck if user is authed
  verifyAuth() {
    if (!this.Auth) {
      alert("You are not logged in, redirecting you...");
      this.router.navigate(['/login']);
    }
  }

  logout() {
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }
}
