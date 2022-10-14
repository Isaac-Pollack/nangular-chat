import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  group: any = '';
  url = "http://localhost:3000";
  username = '';
  userRole = '';
  channels: any = [];

  constructor( private router: Router, private httpClient: HttpClient) {}

  //Check storage and act if some things exist
  ngOnInit() {
    if (!sessionStorage.getItem('username')) {
      sessionStorage.clear();
      alert("Please log in first");
      this.router.navigateByUrl('/login');
    }

    if (!sessionStorage.getItem("group")) {
      alert("error");
      this.router.navigateByUrl("/account");
    }

    this.username = sessionStorage.getItem('username')!;
    this.userRole = sessionStorage.getItem('role')!;
    this.group = sessionStorage.getItem('group');

    //Get channels
    this.httpClient.get(this.url + "/api/getChannels").subscribe((result: any) => {
      for (let i = 0; i < result.length; i++) {
        if (result[i].groupName == this.group){
          console.log(result[i]);
          this.channels.push(result[i]);
        }
      }
    });

  }

  //Route to /adminChannel
  createChannel() {
    this.router.navigateByUrl("/adminChannel");
  }

  //Delete Group
  removeGroup() {
    this.httpClient.get(this.url + "/api/getGroups").subscribe((result: any) => {
      for (let i = 0; i < result.length; i++) {
        if (result[i].title == this.group){
          this.httpClient.post(this.url + "/api/deleteGroup", JSON.stringify(result[i]), httpOptions).subscribe((data: any) => {
            if (data == true) {
              alert("successfully deleted group");
              sessionStorage.removeItem('group');
              this.router.navigateByUrl("/account");
            }
            else {
              alert("error deleting group");
            }
          });
        }
      }
    });

  }

  //Delete channel
  deleteChannel(channel: any) {
    this.httpClient.post(this.url + "/api/deleteChannel", JSON.stringify(channel), httpOptions).subscribe((data: any) => {
      if (data == true) {
        alert("Channel has been deleted");
        window.location.reload();
      }
    });
  }

  goBack() {
    this.router.navigateByUrl("/account");
    sessionStorage.removeItem('group');
  }

//Check channel membership, allow if in
  enterChannel(channel: any) {
    var valid = false;
    for (var index in channel.members) {
      if (channel.members[index] == this.username){
        valid = true;
      }
      else if (this.userRole == "SuperAdmin" || this.userRole == "SuperAdmin"){
        valid = true;
      }
    }
    if (valid == false ) {
      alert("You do not have permission to enter this channel!");
    }
    else {
      sessionStorage.setItem("channel", channel.title);
      this.router.navigateByUrl("/channel");
    }
  }

}
