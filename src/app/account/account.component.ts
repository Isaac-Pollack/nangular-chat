import { Component, OnInit, Type } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";

const httpOptions = {
	headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
	title = "Profile";
	BACKEND_URL = "http://localhost:3000";
	username: string = "";
	userRole: string = "";
	email: string = "";
	users: any = [];
	groups: any = [];
	groupTitles: any = [];
	channels: any = [];
	userToDelete: any = {};

	constructor(private router: Router, private httpClient: HttpClient) {}

	//Check storage and act if some things exist
	ngOnInit() {
		if (sessionStorage.getItem("group")) {
			sessionStorage.removeItem("group");
		}
		if (!sessionStorage.getItem("username")) {
			sessionStorage.clear();
			alert("You are not logged in, redirecting you...");
			this.router.navigateByUrl("/login");
		}

		this.username = sessionStorage.getItem("username")!;
		this.userRole = sessionStorage.getItem("role")!;
		this.email = sessionStorage.getItem("email")!;

		if ((this.userRole = "SuperAdmin" || this.userRole === "GroupAdmin")) {
			//get groups
			this.httpClient
				.get(`${this.BACKEND_URL}/api/getGroups`)
				.subscribe((result: any) => {
					for (let i = 0; i < result.length; i++) {
						this.groups.push(result[i]);
						this.groupTitles.push(result[i].title);
					}
				});
			//get users
			this.httpClient
				.get(`${this.BACKEND_URL}/api/getUsers`)
				.subscribe((result: any) => {
					for (let i = 0; i < result.length; i++) {
						this.users.push(result[i]);
					}
				});
			//get channels, delete any lingering channels with no groups
			this.httpClient
				.get(`${this.BACKEND_URL}/api/getChannels`)
				.subscribe((result: any) => {
					for (let i = 0; i < result.length; i++) {
						if (this.groupTitles.includes(result[i].groupName)) {
							this.channels.push(result[i]);
						} else {
							//if a group no longer exists, delete the channel
							this.httpClient
								.post(
									`${this.BACKEND_URL}/api/deleteChannel`,
									JSON.stringify(result[i]),
									httpOptions,
								)
								.subscribe((data: any) => {
									if (data) {
										console.log("deleted a channel");
									}
								});
						}
					}
				});
		}
		if (this.userRole === "GroupAssis" || this.userRole === "Member") {
			//get only groups that the user is part of
			this.httpClient
				.get(`${this.BACKEND_URL}/api/getGroups`)
				.subscribe((result: any) => {
					for (let i = 0; i < result.length; i++) {
						for (let j = 0; j < result[i].members.length; j++) {
							if (result[i].members[j] === this.username) {
								this.groups.push(result[i]);
							}
						}
					}
				});
		}
	}

	logOut() {
		sessionStorage.clear();
		localStorage.clear();
		this.router.navigateByUrl("/login");
	}

	// Deletes the user object passed into the param
	deleteUser(user: any) {
		this.httpClient
			.post(
				`${this.BACKEND_URL}/api/deleteUser`,
				JSON.stringify(user),
				httpOptions,
			)
			.subscribe((data: any) => {
				if (data === true) {
					alert("User has been deleted");
					window.location.reload();
				}
			});
	}

	updateUser(user: any) {
		sessionStorage.setItem("inputUsername", user.username);
		sessionStorage.setItem("inputEmail", user.email);
		sessionStorage.setItem("inputRole", user.role);
		this.router.navigateByUrl("/admin");
	}

	// Route to /admin
	createUser() {
		this.router.navigateByUrl("/admin");
	}

	/// Route to /groupAdmin
	createGroup() {
		this.router.navigateByUrl("/adminGroup");
	}

	// Deletes the params group object
	deleteGroup(group: any) {
		this.httpClient
			.post(
				`${this.BACKEND_URL}/api/deleteGroup`,
				JSON.stringify(group),
				httpOptions,
			)
			.subscribe((data: any) => {
				if (data === true) {
					alert("Group has been deleted");
					window.location.reload();
				}
			});
	}

	//Takes group object and saves to session for later use
	linkToGroup(group: any) {
		if (!group) {
			console.log("error in link");
		} else {
			sessionStorage.setItem("group", group.title);
			this.router.navigateByUrl("/group");
		}
	}
}
