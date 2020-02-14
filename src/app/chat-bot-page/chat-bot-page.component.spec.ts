import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatBotPageComponent } from './chat-bot-page.component';

describe('ChatBotPageComponent', () => {
  let component: ChatBotPageComponent;
  let fixture: ComponentFixture<ChatBotPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatBotPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatBotPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
