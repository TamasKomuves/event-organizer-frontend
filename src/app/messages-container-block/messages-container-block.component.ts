import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { IUser } from '../interface/IUser';
import { IChatMessage } from '../interface/IChatMessage';

@Component({
  selector: 'app-messages-container-block',
  templateUrl: './messages-container-block.component.html',
  styleUrls: ['./messages-container-block.component.css']
})
export class MessagesContainerBlockComponent implements OnInit {
  @Input() chatMessage: IChatMessage;

  partner: IUser;

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {
    const partnerEmail = this.getPartnerEmail();
    this.userService.getUserByEmail(partnerEmail).subscribe(user => {
      this.partner = user;
    });
  }

  getPartnerEmail() {
    return sessionStorage.getItem('userEmail') !== this.chatMessage.senderEmail
      ? this.chatMessage.senderEmail
      : this.chatMessage.receiverEmail;
  }

  openChatPage(email: string): void {
    this.router.navigate(['/chat-page'], { queryParams: { email: email } });
  }
}
