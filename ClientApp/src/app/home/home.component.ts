import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import * as signalR from "@aspnet/signalr";
import { HubConnection } from "@aspnet/signalr";
import { BehaviorSubject, ReplaySubject } from "rxjs";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  group = new ReplaySubject<any>(1);
  name: string;
  groupId: string;
  hubConnection: signalR.HubConnection;
  connectionId: string;
  message: string;
  messages: string[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("/drink")
      .build();
    this.hubConnection.on("Group", (data) => {
      this.messages.push(this.name + " group updated");
      console.log(this.name + " group updated");
      this.group.next(data);
      this.cdr.detectChanges();
    });
    this.hubConnection.on("ConnectionId", (data) => {
      this.messages.push(this.name + " Connection Id" + data);
      this.connectionId = data;
    });
    this.hubConnection
      .start()
      .then(() => console.log("connection started"))
      .catch((error) => console.log(error));

    console.log(this.hubConnection);
  }

  CreateOrJoin() {
    this.hubConnection
      .invoke("CreateOrJoin", this.groupId, this.name)
      .then((_) => console.log("create or join group"));
  }

  Drink() {
    this.hubConnection.invoke("Drink").then((_) => {
      this.messages.push(this.name + " drink");
      console.log(this.name + " drink");
      this.cdr.detectChanges();
    });
  }

  Start() {
    this.hubConnection
      .invoke("Start")
      .then((_) => console.log("start contest"));
  }

  sendMessage() {
    if (this.message && this.message !== "") {
      this.hubConnection.invoke("SendMessage", this.message).then((_) => {
        console.log(this.name + " sended message");
        this.cdr.detectChanges();
        let scroll = document.getElementById("scroll");
        scroll.scrollTop = scroll.scrollHeight;
      });
      console.log(this.message);
      this.message = "";
    }
  }

  clear() {
    this.group = null;
  }
}
