import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { UserService } from '../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { IUser } from '../interface/IUser';
import { IChatMessage } from '../interface/IChatMessage';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Message } from '../interface/Message';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css']
})
export class ChatPageComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollbarDiv', { static: true }) private myScrollContainer: ElementRef;
  messages: Array<IChatMessage> = new Array();
  chatPartnerEmail: string;
  newMessageText: string;
  partnerName: string;
  stompClient: any;
  isLoaded = false;
  subscription: any;
  userEmail: string;

  constructor(private userService: UserService, private route: ActivatedRoute) {}

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

  initWebSocket() {
    const ws = new SockJS('http://localhost:8080/socket/?t=' + sessionStorage.getItem('token'));
    this.stompClient = Stomp.over(ws);
    this.stompClient.debug = () => {};
    const that = this;
    this.stompClient.connect({}, function(frame) {
      that.isLoaded = true;
      that.openSocket();
    });
  }

  openSocket() {
    if (this.isLoaded) {
      console.log(this.calculateSocketTopicName());
      this.subscription = this.stompClient.subscribe(
        '/socket-publisher/' + this.calculateSocketTopicName(),
        socketMessage => {
          const chatMessage: IChatMessage = JSON.parse(socketMessage.body);
          console.log(chatMessage);

          this.messages.push(chatMessage);
        }
      );
    }
  }

  calculateSocketTopicName(): string {
    return this.userEmail.localeCompare(this.chatPartnerEmail) > 0
      ? this.chatPartnerEmail + '-' + this.userEmail
      : this.userEmail + '-' + this.chatPartnerEmail;
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

    const message: Message = {
      text: this.newMessageText,
      senderEmail: this.userEmail,
      receiverEmail: this.chatPartnerEmail
    };
    this.stompClient.send('/socket-subscriber/send/message', {}, JSON.stringify(message));
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
