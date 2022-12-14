import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { StorageService } from "../services/storage.service";

const httpOptions = {
	headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	username = "";
	password: any = "";
	user: any = {};
	url = "http://localhost:3000";
	storageEnabled: boolean = false;

	constructor(
		private router: Router,
		private httpClient: HttpClient,
		public StorageService: StorageService,
	) {}

	ngOnInit() {
		//Tests storage for validity
		if (typeof Storage !== "undefined") {
			this.storageEnabled = true;
			console.log(`Session Storage enabled: ${this.storageEnabled}`);
			console.log(sessionStorage);
		} else {
			this.storageEnabled = false;
			console.log(`Session Storage enabled: ${this.storageEnabled}`);
		}
	}

	//Validate credentials and store to session storage
	submit() {
		//Validation
		this.user = this.validate(this.username, this.password);

		if (this.user != null) {
			this.httpClient
				.post(`${this.url}/api/auth`, JSON.stringify(this.user), httpOptions)
				.subscribe((data: any) => {
					if (data.valid) {
						sessionStorage.setItem("username", data.username);
						this.httpClient
							.get(`${this.url}/api/getUsers`)
							.subscribe((result: any) => {
								for (let i = 0; i < result.length; i++) {
									if (result[i].username === data.username) {
										sessionStorage.setItem("role", result[i].role);
										sessionStorage.setItem("email", result[i].email);
										this.router.navigateByUrl("/account");
									}
								}
							});
					} else {
						console.log("Unsuccessfull authentication, please try again!");
						alert("Incorrect credentials!");
					}
				});
		}
	}

	validate(username: any, password: any) {
		var usernameValid = true;
		var passwordValid = true;
		var error: string = "";

		if (username.length > 0) {
			//Not empty
			for (let i = 0; i < username.length; i++) {
				//No spaces
				if (username.charAt(i) === " ") {
					usernameValid = false;
					error = "Username and/or Password must not contain spaces";
				}
			}
		} else {
			usernameValid = false;
			error = "Username and/or Password must not be empty";
		}

		if (password !== "") {
			//Not empty
		} else {
			passwordValid = false;
			error = "Password must not be empty";
		}

		if (usernameValid && passwordValid) {
			return { username: username, password: password };
		} else {
			alert(error);
			return;
		}
	}
}
