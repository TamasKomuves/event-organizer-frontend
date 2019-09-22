import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css']
})
export class ChatPageComponent implements OnInit {
  messages: Array<any>;
  chatPartnerEmail: string;
  newMessageText: string;

  constructor() {}

  ngOnInit() {
    this.chatPartnerEmail = 'c@gmail.com';
    this.messages = new Array(
      {
        text: 'This is the first message',
        isCurrentUserSent: true,
        dateSent: '2019-09-19 17:01:24'
      },
      {
        text: 'This is the third message',
        isCurrentUserSent: true,
        dateSent: '2019-09-19 17:02:14'
      },
      {
        text: 'This is the second message',
        isCurrentUserSent: false,
        dateSent: '2019-09-19 17:01:40'
      }
    );

    this.messages.sort((a, b) => a.dateSent.localeCompare(b.dateSent));
  }

  sendMessage(): void {
    this.newMessageText = this.newMessageText.trim();
    if (this.newMessageText === null || this.newMessageText === '' || this.newMessageText === undefined) {
      alert('Empty message!');
      return;
    }
    this.messages.push({
      text: this.newMessageText,
      isCurrentUserSent: true,
      dateSent: '2019-09-19 17:01:24'
    });
    this.newMessageText = '';
  }
}
