import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiAiClient, IServerResponse } from 'api-ai-javascript/es6/ApiAiClient';

@Injectable({
  providedIn: 'root'
})
export class TensorflowChatServiceService {
  readonly token = environment.dialogflow.angularBot;
  readonly client = new ApiAiClient({ accessToken: this.token });
  conversation = new BehaviorSubject<any>([]);

  constructor() {}

  sendMessage(msg: string): Promise<IServerResponse> {
    return this.client.textRequest(msg);
  }
}
