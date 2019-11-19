import { Component, OnInit } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Message } from '../interface/Message';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  stompClient: any;
  isLoaded = false;
  isCustomSocketOpened = false;
  messages;

  constructor() {}

  ngOnInit() {
    const ws = new SockJS('http://localhost:8080/socket/?t=' + sessionStorage.getItem('token'));
    this.stompClient = Stomp.over(ws);
    const that = this;
    this.stompClient.connect({}, function(frame) {
      that.isLoaded = true;
      that.openGlobalSocket();
    });
  }

  openGlobalSocket() {
    this.stompClient.subscribe('/socket-publisher', message => {
      this.handleResult(message);
    });
  }

  openSocket() {
    if (this.isLoaded) {
      this.isCustomSocketOpened = true;
      this.stompClient.subscribe('/socket-publisher/' + '12', message => {
        this.handleResult(message);
      });
    }
  }

  handleResult(message) {
    if (message.body) {
      const messageResult: Message = JSON.parse(message.body);
      console.log(messageResult);
      this.messages.push(messageResult);
    }
  }

  sendMessageUsingSocket() {
    const message: Message = { message: 'csacsa', fromId: '12', toId: '13' };
    this.stompClient.send('/socket-subscriber/send/message', {}, JSON.stringify(message));
  }
}
