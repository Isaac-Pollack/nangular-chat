import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

const httpOptions = {
	headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Component({
  selector: 'app-admin-channel',
  templateUrl: './admin-channel.component.html',
  styleUrls: ['./admin-channel.component.css']
})
export class AdminChannelComponent implements OnInit {
	//logged in user data
	username = "";
	userRole = "";
	title: string = "";
	groupName: string = "";
	members = [];
	users: any = [];
	groups: any = [];
	channels: any = [];
	url = "http://localhost:3000";

	constructor(private httpClient: HttpClient, private router: Router) {}

	//Check storage and act if some things exist
	ngOnInit(): void {
		if (!sessionStorage.getItem("username")) {
			sessionStorage.clear();
			alert("Please log in first");
			this.router.navigateByUrl("/login");
		}

		//Return Users
		this.httpClient.get(`${this.url}/api/getUsers`).subscribe((result: any) => {
			for (let i = 0; i < result.length; i++) {
				this.users.push(result[i]);
			}
		});

		//Return Groups
		this.httpClient
			.get(`${this.url}/api/getGroups`)
			.subscribe((result: any) => {
				for (let i = 0; i < result.length; i++) {
					this.groups.push(result[i]);
				}
			});

		//Return Channels
		this.httpClient
			.get(`${this.url}/api/getChannels`)
			.subscribe((result: any) => {
				for (let i = 0; i < result.length; i++) {
					this.channels.push(result[i]);
				}
			});

		//get group from session storage
		this.groupName = sessionStorage.getItem("group")!;
	}

	//Create channel
	createChannel() {
		var channelObj = {
			title: this.title,
			groupName: this.groupName,
			members: this.members,
		};

		this.httpClient
			.post(
				`${this.url}/api/insertChannel`,
				JSON.stringify(channelObj),
				httpOptions,
			)
			.subscribe((result: any) => {
				if (result === true) {
					alert("successfully created channel");
					this.router.navigateByUrl("/group");
				} else {
					alert("error creating channel");
				}
			});
	}

	//Delete channel
	deleteChannel(channel: any) {
		this.httpClient
			.post(
				`${this.url}/api/deleteChannel`,
				JSON.stringify(channel),
				httpOptions,
			)
			.subscribe((data: any) => {
				if (data === true) {
					alert("Channel has been deleted");
					window.location.reload();
				}
			});
	}

	goBack() {
		this.router.navigateByUrl("/account");
	}
}
