import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PollAnswerComponent } from './poll-answer.component';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { IPollAnswer } from '../interface/IPollAnswer';

describe('PollAnswerComponent', () => {
  const apiUrl = environment.apiUrl;

  let component: PollAnswerComponent;
  let fixture: ComponentFixture<PollAnswerComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PollAnswerComponent],
      imports: [FormsModule, HttpClientTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PollAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    httpMock = TestBed.get(HttpTestingController);

    component.answerId = 4;
    component.isLoaded = false;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init checkbox be true', () => {
    component.initCheckbox();

    const req = httpMock.expectOne(apiUrl + 'poll-answers/4/is-already-selected');
    expect(req.request.method).toBe('GET');
    req.flush({ isAlreadySelected: 'true' });
    expect(component.isAlreadySelected).toBeTruthy();
  });

  it('should init checkbox be false', () => {
    component.initCheckbox();

    const req = httpMock.expectOne(apiUrl + 'poll-answers/4/is-already-selected');
    expect(req.request.method).toBe('GET');
    req.flush({ isAlreadySelected: 'false' });
    expect(component.isAlreadySelected).toBeFalsy();
  });

  it('should init answer', () => {
    component.initAnswer();

    const req = httpMock.expectOne(apiUrl + 'poll-answers/4');
    expect(req.request.method).toBe('GET');
    const answer: IPollAnswer = { text: 'answerText' };
    req.flush(answer);
    expect(component.answer).toBe(answer);
    expect(component.text).toBe('answerText');
  });

  it('should update votes', () => {
    component.updateVotes();

    const req = httpMock.expectOne(apiUrl + 'poll-answers/4/votes');
    expect(req.request.method).toBe('GET');
    const votes = new Array();
    votes.push({});
    votes.push({});
    req.flush(votes);
    expect(component.votes).toBe(votes);
    expect(component.numberOfVotes).toBe(2);
    expect(component.isLoaded).toBeTruthy();
  });

  it('should remove a vote from the answer', () => {
    component.removeVoteFromAnswer();

    const req = httpMock.expectOne(apiUrl + 'poll-answers/4/remove-respondent');
    expect(req.request.method).toBe('GET');
  });

  it('should add a vote to the answer', () => {
    component.voteForAnswer();

    const req = httpMock.expectOne(apiUrl + 'poll-answers/4/add-respondent');
    expect(req.request.method).toBe('GET');
  });
});
