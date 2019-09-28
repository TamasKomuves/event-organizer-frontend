import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css']
})
export class ChatPageComponent implements OnInit {
  messages: Array<any>;
  chatPartnerEmail: string;
  newMessageText: string;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.chatPartnerEmail = 'a@gmail.com';

    this.userService.getCurrentUser().subscribe(user => {
      this.userService.getAllChatMessages(user.email, this.chatPartnerEmail).subscribe(messages => {
        this.messages = messages;
        this.messages.sort((a, b) => a.date.localeCompare(b.date));
      });
    });
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
      date: '2019-09-19 17:01:24'
    });
    this.newMessageText = '';
  }
}
