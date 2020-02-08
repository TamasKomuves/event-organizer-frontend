import { Injectable } from '@angular/core';
import { BaseRestService } from './base-rest.service';
import { HttpClient } from '@angular/common/http';
import { IPollQuestion } from 'src/app/interface/IPollQuestion';
import { IPollAnswer } from 'src/app/interface/IPollAnswer';

@Injectable({
  providedIn: 'root'
})
export class PollQuestionService extends BaseRestService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getPollQuiestionById(id: number) {
    const url = 'poll-questions/' + id;
    return this.getMethod<IPollQuestion>(url);
  }

  getPollAnswerIdsByQuestionId(questionId: number) {
    const url = 'poll-questions/' + questionId + '/answerIds';
    return this.getMethod<Array<Number>>(url);
  }

  createPoll(eventId: number, questionText: string, pollAnswers: Array<IPollAnswer>) {
    const url = 'poll-questions/createPoll';
    const body = {
      eventId: eventId,
      questionText: questionText,
      pollAnswers: pollAnswers
    };

    return this.postMethod(url, body);
  }

  deletePoll(pollId: number) {
    const url = 'poll-questions/' + pollId + '/delete';
    return this.deleteMethod(url);
  }
}
