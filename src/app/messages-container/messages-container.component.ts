import { Component, OnInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { UserService } from '../services/user.service';
import { IChatMessage } from '../interface/IChatMessage';

@Component({
  selector: 'app-messages-container',
  templateUrl: './messages-container.component.html',
  styleUrls: ['./messages-container.component.css']
})
export class MessagesContainerComponent implements OnInit {
  chatMessages: Array<IChatMessage> = new Array();

  constructor(private ngxSmartModalService: NgxSmartModalService, private userService: UserService) {}

  ngOnInit() {
    this.userService.getLastMessages().subscribe(chatMessages => {
      this.chatMessages = chatMessages;
      this.chatMessages.sort((a, b) => b.date.localeCompare(a.date));
    });
  }

  openFindUserToMessageModal(): void {
    const modal = this.ngxSmartModalService.getModal('findUserToMessageModal');
    modal.open();
  }
}
