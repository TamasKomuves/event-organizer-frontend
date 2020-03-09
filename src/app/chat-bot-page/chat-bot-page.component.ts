import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { IBotMessage } from '../interface/IBotMessage';
import { TensorflowChatServiceService } from '../services/tensorflow-chat-service.service';
import { IServerResponse } from 'api-ai-javascript/es6/ApiAiClient';

@Component({
  selector: 'app-chat-bot-page',
  templateUrl: './chat-bot-page.component.html',
  styleUrls: ['./chat-bot-page.component.css']
})
export class ChatBotPageComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollbarDiv', { static: true }) private myScrollContainer: ElementRef;
  messages: Array<IBotMessage> = new Array<IBotMessage>();
  newMessageText: string;

  constructor(public botChatService: TensorflowChatServiceService) {}

  ngOnInit() {}

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  isUserSent(chatMessage: IBotMessage): boolean {
    return !chatMessage.isFromBot;
  }

  sendMessage(): void {
    const userMessage: IBotMessage = {
      text: this.newMessageText,
      date: new Date().toString(),
      isFromBot: false
    };
    this.messages.push(userMessage);

    this.botChatService.sendMessage(this.newMessageText).then((res: IServerResponse) => {
      const resultMessageText = res.result.fulfillment.speech;
      const botMessage: IBotMessage = {
        text: resultMessageText,
        date: new Date().toString(),
        isFromBot: true
      };
      this.messages.push(botMessage);
      this.newMessageText = '';
    });
  }

  private scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
}
