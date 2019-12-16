import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseRestService } from './base-rest.service';
import { IChatMessage } from 'src/app/interface/IChatMessage';

@Injectable({
  providedIn: 'root'
})
export class ChatMessageService extends BaseRestService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getAllChatMessages(partnerEmail: string) {
    const url = 'chat-messages/all-messages/' + partnerEmail;
    return this.getMethod<Array<IChatMessage>>(url);
  }

  getLastMessages() {
    const url = 'chat-messages/last-messages';
    return this.getMethod<Array<IChatMessage>>(url);
  }

  getNotSeenChatMessageCount() {
    const url = 'chat-messages/not-seen';
    return this.getMethod(url);
  }

  updateMessagesWithPartnerToAlreadySeen(partnerEmail: string) {
    const url = 'chat-messages/mark-all-as-seen/' + partnerEmail;
    return this.putMethod(url, null);
  }
}
