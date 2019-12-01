import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

export class WebsocketService {
  stompClient: any;
  isLoaded = false;
  subscriptionsMap: Map<string, any> = new Map();

  connect(topicName: string, onMessage: (socketMessage: any) => void, messageToSend?: any): void {
    const ws = new SockJS('http://localhost:8080/socket/?t=' + sessionStorage.getItem('token'));
    this.stompClient = Stomp.over(ws);
    this.stompClient.debug = () => {};
    const that = this;

    this.stompClient.connect({}, function(frame) {
      that.isLoaded = true;
      if (topicName) {
        const subscription = that.stompClient.subscribe(topicName, onMessage);
        that.subscriptionsMap.set(topicName, subscription);
      }
      if (messageToSend) {
        that.send(messageToSend['messageTarget'], messageToSend['message']);
      }
    });
  }

  send(messageTarget: string, message: string) {
    this.stompClient.send(messageTarget, {}, message);
  }

  unsubscribe(topicName: string): void {
    this.subscriptionsMap.get(topicName).unsubscribe();
    this.subscriptionsMap.delete(topicName);
  }
}
