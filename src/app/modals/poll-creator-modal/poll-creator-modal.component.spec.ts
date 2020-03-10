import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PollCreatorModalComponent } from './poll-creator-modal.component';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { IPollAnswer } from 'src/app/interface/IPollAnswer';

describe('PollCreatorModalComponent', () => {
  const apiUrl = environment.apiUrl;
  let component: PollCreatorModalComponent;
  let fixture: ComponentFixture<PollCreatorModalComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PollCreatorModalComponent],
      imports: [
        TranslateModule.forRoot(),
        FormsModule,
        HttpClientTestingModule,
        NgxSmartModalModule.forRoot()
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PollCreatorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    httpMock = TestBed.get(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init the modal', () => {
    component.initModal();

    expect(component.questionText).toBe('');
    expect(component.answers.length).toBe(1);
    expect(component.answers[0].text).toBe('');
  });

  it('should add an empty answer', () => {
    component.answers = [{ text: 'answer1' }];

    component.addAnswer();

    expect(component.answers.length).toBe(2);
    expect(component.answers[1].text).toBe('');
  });

  it('should remove the last answer', () => {
    component.answers = [{ text: 'answer1' }, { text: 'answer2' }];

    component.removeAnswer();

    expect(component.answers.length).toBe(1);
    expect(component.answers[0].text).toBe('answer1');
  });

  it('should save the poll', () => {
    component.eventId = 4;
    component.questionText = 'How are you?';
    component.answers = [{ text: 'answer1' }, { text: 'answer2' }];

    component.createPoll();
    const req1 = httpMock.expectOne(apiUrl + 'poll-questions/createPoll');
    expect(req1.request.method).toBe('POST');
    expect(req1.request.body.eventId).toBe(4);
    expect(req1.request.body.questionText).toBe('How are you?');
    expect(req1.request.body.pollAnswers.length).toBe(2);
  });
});
