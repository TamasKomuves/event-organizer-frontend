import { Component, OnInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { IUser } from '../interface/IUser';

@Component({
  selector: 'app-messages-container',
  templateUrl: './messages-container.component.html',
  styleUrls: ['./messages-container.component.css']
})
export class MessagesContainerComponent implements OnInit {
  chatMessages: any;
  // partner: IUser;

  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.getLastMessages().subscribe(chatMessages => {
      this.chatMessages = chatMessages;
      this.chatMessages.array.forEach(chatMessage => {
        this.userService.getUserByEmail(chatMessage.partnerEmail).subscribe(user => {
          // this.partner = user;
        });
      });
    });
  }

  openChatPage(email: string): void {
    this.router.navigate(['/chat-page'], { queryParams: { email: email } });
  }

  openFindUserToMessageModal(): void {
    const modal = this.ngxSmartModalService.getModal('findUserToMessageModal');
    modal.open();
  }
}
