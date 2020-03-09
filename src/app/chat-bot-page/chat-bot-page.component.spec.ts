import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatBotPageComponent } from './chat-bot-page.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IBotMessage } from '../interface/IBotMessage';

describe('ChatBotPageComponent', () => {
  let component: ChatBotPageComponent;
  let fixture: ComponentFixture<ChatBotPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChatBotPageComponent],
      imports: [TranslateModule.forRoot(), FormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatBotPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return that the user sent the message', () => {
    const chatMessage: IBotMessage = { date: '2019-04-05 14:00', isFromBot: false, text: 'Hi' };

    const result = component.isUserSent(chatMessage);
    expect(result).toBeTruthy();
  });

  it('should send the message', () => {
    component.newMessageText = 'Hi';
    const res = { result: { fulfillment: { speech: 'hello' } } };
    const sendMessageSpy = spyOn(component.botChatService, 'sendMessage').and.returnValue(
      Promise.resolve(res)
    );

    component.sendMessage();
    expect(component.messages[0].text).toBe('Hi');
    expect(sendMessageSpy).toHaveBeenCalledWith('Hi');
  });
});
