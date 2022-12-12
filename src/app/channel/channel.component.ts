import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Socket } from "socket.io-client";
import { SocketService } from "../services/socket.service";

const httpOptions = {
	headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit {
	username: string = "";
	userRole: string = "";
	group: string = "";
	channelTitle: string = "";
	messageContent: any = "";
	messages: string[] = [];
	formattedMessages: { name: string; time: string; message: string }[] = [];
	ioConnection: any;
	userJoined: string = "";
	url = "http://localhost:3000";

	constructor(
		private router: Router,
		private socketService: SocketService,
		private httpClient: HttpClient,
	) {}

	//Check storage and act if some things exist
	ngOnInit(): void {
		if (!sessionStorage.getItem("username")) {
			sessionStorage.clear();
			alert("Please log in first");
			this.router.navigateByUrl("/login");
		}

		if (!sessionStorage.getItem("group")) {
			alert("error");
			this.router.navigateByUrl("/account");
		}

		if (!sessionStorage.getItem("channel")) {
			alert("error");
			this.router.navigateByUrl("/group");
		}

		this.username = sessionStorage.getItem("username")!;
		this.userRole = sessionStorage.getItem("role")!;
		this.group = sessionStorage.getItem("group")!;
		this.channelTitle = sessionStorage.getItem("channel")!;

		//Get chat history
		this.httpClient.get(`${this.url}/api/getChats`).subscribe((result: any) => {
			for (let i = 0; i < result.length; i++) {
				if (result[i].channel === this.channelTitle) {
					for (let j = 0; j < result[i].chats.length; j++) {
						this.messages.push(result[i].chats[j]);
						this.formattedMessages.push(
							this.stringFormatter(result[i].chats[j]),
						);
					}
				}
			}
		});
		this.initIoConnection();
	}

	//Init socket and subscribe to events
	initIoConnection() {
		this.socketService.initSocket(this.channelTitle, this.username);

		this.ioConnection = this.socketService
			.getUsersJoined()
			.subscribe((content: any) => {
				this.userJoined = content;
			});

		this.ioConnection = this.socketService
			.getUserDisconnected()
			.subscribe((content: any) => {
				this.userJoined = content;
			});

		this.ioConnection = this.socketService
			.getMessage()
			.subscribe((message: any) => {
				this.messages.push(message);
				let chatsObj = { channel: this.channelTitle, chats: this.messages };
				//Save chat history
				this.httpClient
					.post(
						`${this.url}/api/insertChats`,
						JSON.stringify(chatsObj),
						httpOptions,
					)
					.subscribe((result: any) => {
						if (result === true) {
							console.log("db updated");
						}
					});
				this.formattedMessages.push(this.stringFormatter(message));
			});
	}

	//Disconnect socket and remove channel from storage, redirecting
	goBack() {
		this.socketService.disconnectUser();
		sessionStorage.removeItem("channel");
		this.router.navigateByUrl("/group");
	}

	//Send message to socket
	sendMessage() {
		console.log(this.formattedMessages);
		if (this.messageContent) {
			this.socketService.send(this.messageContent, this.username);
			this.messageContent = null;
		} else {
			console.log("no message to send");
		}
	}

	//Delete the messages array for that channel
	clearHistory() {
		let chatsObj = { channel: this.channelTitle, chats: this.messages };
		this.httpClient
			.post(
				`${this.url}/api/deleteChats`,
				JSON.stringify(chatsObj),
				httpOptions,
			)
			.subscribe((result: any) => {
				if (!result) {
					alert("there is no history to delete");
				} else {
					window.location.reload();
				}
			});
	}

	stringFormatter(message: any) {
		var wordArray = message.split(" ");

		//0 is Username
		var name = wordArray[0];
		//2 is Time
		var time = wordArray[2];
		var arrayLength = wordArray.length;
		var numToSlice = arrayLength - 4;
		var theMessage = wordArray.splice(4, numToSlice);
		theMessage = theMessage.join(" ");

		console.log(name, time, theMessage);
		var msgObj = {
			name: String(name),
			time: String(time),
			message: String(theMessage),
		};
		return msgObj;
	}
}
