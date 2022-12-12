import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UserModel } from "./user.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {
	url = "http://localhost:3000/";

	constructor(private http: HttpClient) {}

	userInsert(user: any) {
		console.log(user);
		this.http
			.post(`${this.url}usersInsert`, user)
			.subscribe((res) => console.log("done"));
	}

	userFind() {
		return this.http.get<UserModel[]>(`${this.url}usersFind`);
	}

	userUpdate(userQuery: any, userUpdate: any) {
		const queryUpdate = { query: userQuery, update: userUpdate };
		return this.http.put(`${this.url}usersUpdate`, queryUpdate);
	}

	usersDelete(user: any) {
		console.log(user);
		this.http
			.delete(`${this.url}usersDelete`, user)
			.subscribe((res) => console.log("done"));
	}
}
