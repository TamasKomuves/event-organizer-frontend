import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { IUser } from '../interface/IUser';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css']
})
export class ChatPageComponent implements OnInit {
  messages: Array<any> = new Array();
  chatPartnerEmail: string;
  newMessageText: string;
  partnerName: string;

  constructor(private userService: UserService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.chatPartnerEmail = this.route.snapshot.queryParamMap.get('email');

    this.userService.getAllChatMessages(this.chatPartnerEmail).subscribe(messages => {
      this.messages = messages;
      this.messages.sort((a, b) => a.date.localeCompare(b.date));
    });
    this.userService.getUserByEmail(this.chatPartnerEmail).subscribe(user => {
      this.partnerName = this.getUserDisplayName(user);
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

  private getUserDisplayName(user: IUser): string {
    return user.firstName + ' ' + user.lastName + ' (' + user.email + ')';
  }
}
