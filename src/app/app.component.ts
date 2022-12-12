import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = "3813ICT Assignment";
	Auth = false;
	user = localStorage.getItem("user");

	constructor(private router: Router) {
		if (sessionStorage.getItem("username") !== undefined) {
			this.Auth = true;
		}
	}

	ngOnInit() {
		if (sessionStorage.getItem("username") !== undefined) {
			this.Auth = true;
		}
	}

	//If not logged in, redirect.
	verifyAuth() {
		if (!this.Auth) {
			alert("You are not logged in, redirecting you...");
			this.router.navigate(["/login"]);
		}
	}

	logout() {
		localStorage.clear();
		sessionStorage.clear();
		this.router.navigate(["/login"]);
	}
}
