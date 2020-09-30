import { Component, OnInit } from "@angular/core";
import * as signalR from "@aspnet/signalr";
import { HubConnection } from "@aspnet/signalr";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  group: any;
  email: string;
  groupId: string;
  hubConnection: signalR.HubConnection;
  connectionId: string;

  ngOnInit() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("/drink")
      .build();
    this.hubConnection.on("Group", (data) => {
      this.group = data;
    });
    this.hubConnection.on("ConnectionId", (data) => {
      this.connectionId = data;
    });
    this.hubConnection
      .start()
      .then(() => console.log("connection started"))
      .catch((error) => console.log(error));

    console.log(this.hubConnection);
  }

  CreateOrJoin() {
    this.hubConnection.invoke("CreateOrJoin", this.groupId, this.email);
  }

  Drink() {
    this.hubConnection.invoke("Drink");
  }

  Start() {
    this.hubConnection.invoke("Start");
  }

  clear() {
    this.group = null;
  }
}
