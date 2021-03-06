import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { ISubscription } from '../interface/ISubscription';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class WebsocketService {
  stompClient: any;
  subscriptionMap: Map<string, ISubscription> = new Map();
  messagesToSend: Map<string, any> = new Map();
  isConnecting = false;

  subscribe(subscription: ISubscription): void {
    if (this.stompClient !== undefined && this.stompClient.connected) {
      subscription.subscriptionHolder = this.stompClient.subscribe(
        subscription.topicName,
        subscription.onMessage
      );
      this.subscriptionMap.set(subscription.topicName, subscription);
    } else {
      subscription.subscriptionHolder = null;
      this.subscriptionMap.set(subscription.topicName, subscription);
      this.connect();
    }
  }

  connect(): void {
    if (this.stompClient === undefined && !this.isConnecting) {
      this.isConnecting = true;
      const ws = new SockJS(environment.apiUrl + 'socket/?t=' + sessionStorage.getItem('token'));
      this.stompClient = Stomp.over(ws);
      this.stompClient.debug = () => {};
    }
    const that = this;
    this.stompClient.connect({}, function(frame) {
      that.isConnecting = false;
      that.subscriptionMap.forEach(subscription => {
        if (subscription.subscriptionHolder === null) {
          subscription.subscriptionHolder = that.stompClient.subscribe(
            subscription.topicName,
            subscription.onMessage
          );
        }
      });
      that.messagesToSend.forEach(messageToSend => {
        that.send(messageToSend['messageTarget'], messageToSend['message']);
      });
      that.messagesToSend.clear();
    });
  }

  send(messageTarget: string, message: string) {
    if (this.stompClient !== undefined && this.stompClient.connected) {
      this.stompClient.send(messageTarget, {}, message);
    } else {
      this.messagesToSend.set(messageTarget, { messageTarget: messageTarget, message: message });
      this.connect();
    }
  }

  unsubscribe(topicName: string): void {
    const subscription: ISubscription = this.subscriptionMap.get(topicName);
    if (subscription) {
      if (subscription.subscriptionHolder) {
        subscription.subscriptionHolder.unsubscribe();
      }
      this.subscriptionMap.delete(topicName);
    }
  }

  unsubscribeAll(): void {
    this.subscriptionMap.forEach(subscription => {
      this.unsubscribe(subscription.topicName);
    });
  }
}
