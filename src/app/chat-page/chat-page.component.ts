import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  OnDestroy
} from '@angular/core';
import { UserService } from '../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { IUser } from '../interface/IUser';
import { IChatMessage } from '../interface/IChatMessage';
import { WebsocketService } from '../services/websocket.service';
import { ISubscription } from '../interface/ISubscription';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css']
})
export class ChatPageComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('scrollbarDiv', { static: true }) private myScrollContainer: ElementRef;
  messages: Array<IChatMessage> = new Array();
  chatPartnerEmail: string;
  newMessageText: string;
  partnerName: string;
  userEmail: string;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private websocketService: WebsocketService
  ) {}

  ngOnInit() {
    this.userEmail = sessionStorage.getItem('userEmail');
    this.chatPartnerEmail = this.route.snapshot.queryParamMap.get('email');

    this.initWebSocket();

    this.userService.getAllChatMessages(this.chatPartnerEmail).subscribe(messages => {
      this.messages = messages;
      this.messages.sort((a, b) => a.date.localeCompare(b.date));
    });
    this.userService.getUserByEmail(this.chatPartnerEmail).subscribe(user => {
      this.partnerName = this.getUserDisplayName(user);
    });
  }

  ngOnDestroy() {
    this.websocketService.unsubscribe(this.calculateTopicName());
  }

  initWebSocket() {
    const sub0: ISubscription = {
      topicName: this.calculateTopicName(),
      onMessage: socketMessage => {
        const chatMessage: IChatMessage = JSON.parse(socketMessage.body);
        this.messages.push(chatMessage);
      }
    };
    this.websocketService.subscribe(sub0);
  }

  calculateTopicName(): string {
    const chatroomName: string =
      this.userEmail.localeCompare(this.chatPartnerEmail) > 0
        ? this.chatPartnerEmail + '-' + this.userEmail
        : this.userEmail + '-' + this.chatPartnerEmail;
    return '/socket-publisher/' + chatroomName;
  }

  isCurrentUserSent(chatMessage: IChatMessage): boolean {
    return chatMessage.senderEmail === this.userEmail;
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  sendMessage() {
    this.newMessageText = this.newMessageText.trim();
    if (
      this.newMessageText === null ||
      this.newMessageText === '' ||
      this.newMessageText === undefined
    ) {
      alert('Empty message!');
      return;
    }

    const message: IChatMessage = {
      text: this.newMessageText,
      receiverEmail: this.chatPartnerEmail
    };
    this.websocketService.send('/socket-subscriber/send/message', JSON.stringify(message));
    this.newMessageText = '';
  }

  private scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  private getUserDisplayName(user: IUser): string {
    return user.firstName + ' ' + user.lastName + ' (' + user.email + ')';
  }
}
