import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { IChatMessage } from '../interface/IChatMessage';
import { WebsocketService } from '../services/websocket.service';
import { ISubscription } from '../interface/ISubscription';
import { ChatMessageService } from '../services/rest/chat-message.service';

@Component({
  selector: 'app-messages-container',
  templateUrl: './messages-container.component.html',
  styleUrls: ['./messages-container.component.css']
})
export class MessagesContainerComponent implements OnInit, OnDestroy {
  chatMessages: Array<IChatMessage> = new Array();

  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private websocketService: WebsocketService,
    private chatMessageService: ChatMessageService
  ) {}

  ngOnInit() {
    this.chatMessageService.getLastMessages().subscribe(chatMessages => {
      this.chatMessages = chatMessages;
      this.chatMessages.sort((a, b) => b.date.localeCompare(a.date));
    });
    this.initWebsocket();
  }

  ngOnDestroy() {
    const userEmail = sessionStorage.getItem('userEmail');
    this.websocketService.unsubscribe('/socket-publisher/chat-message/' + userEmail);
  }

  openFindUserToMessageModal(): void {
    const modal = this.ngxSmartModalService.getModal('findUserToMessageModal');
    modal.dismissable = false;
    modal.open();
  }

  initWebsocket(): void {
    const userEmail = sessionStorage.getItem('userEmail');
    const sub0: ISubscription = {
      topicName: '/socket-publisher/chat-message/' + userEmail,
      onMessage: socketMessage => {
        const receivedChatMessage: IChatMessage = JSON.parse(socketMessage.body);
        const receivedPartnerEmail = this.getChatPartnerEmail(receivedChatMessage);

        this.chatMessages = this.chatMessages.filter(
          chatMessage => this.getChatPartnerEmail(chatMessage) !== receivedPartnerEmail
        );
        this.chatMessages.unshift(receivedChatMessage);
      }
    };
    this.websocketService.subscribe(sub0);
  }

  getChatPartnerEmail(chatMessage: IChatMessage): string {
    const userEmail = sessionStorage.getItem('userEmail');
    return chatMessage.senderEmail !== userEmail
      ? chatMessage.senderEmail
      : chatMessage.receiverEmail;
  }
}
