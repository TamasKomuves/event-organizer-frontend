import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PollBlockComponent } from './poll-block.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { PollAnswerComponent } from '../poll-answer/poll-answer.component';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';

describe('PollBlockComponent', () => {
  const apiUrl = environment.apiUrl;
  let component: PollBlockComponent;
  let fixture: ComponentFixture<PollBlockComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PollBlockComponent, PollAnswerComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, FormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PollBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    httpMock = TestBed.get(HttpTestingController);

    component.pollId = 6;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the answers', () => {
    component.updateAnswers();

    const req1 = httpMock.expectOne(apiUrl + 'poll-questions/6/answerIds');
    expect(req1.request.method).toBe('GET');
    req1.flush([2, 5, 7]);
    expect(component.answerIds).toEqual([2, 5, 7]);
  });

  it('should create a new answer', () => {
    component.newAnswerText = 'Answer 1';

    component.createNewAnswer();

    const req1 = httpMock.expectOne(apiUrl + 'poll-answers/create');
    expect(req1.request.method).toBe('POST');
    expect(req1.request.body.pollQuestionId).toBe(6);
    expect(req1.request.body.text).toBe('Answer 1');
    req1.flush({});
    const req2 = httpMock.expectOne(apiUrl + 'poll-questions/6/answerIds');
    expect(req2.request.method).toBe('GET');
    expect(component.newAnswerText).toBe('');
  });

  it('should delete the poll', () => {
    component.deletePoll();

    const req1 = httpMock.expectOne(apiUrl + 'poll-questions/6/delete');
    expect(req1.request.method).toBe('DELETE');
  });
});
