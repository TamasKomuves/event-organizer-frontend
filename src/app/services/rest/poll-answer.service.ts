import { Injectable } from '@angular/core';
import { BaseRestService } from './base-rest.service';
import { HttpClient } from '@angular/common/http';
import { IPollAnswer } from 'src/app/interface/IPollAnswer';

@Injectable({
  providedIn: 'root'
})
export class PollAnswerService extends BaseRestService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getPollAnswerById(id: number) {
    const url = 'poll-answers/' + id;
    return this.getMethod<IPollAnswer>(url);
  }

  getVotesForAnswerById(id: number) {
    const url = 'poll-answers/' + id + '/votes';
    return this.getMethod(url);
  }

  addRespondentToAnswer(pollAnswerId: number) {
    const url = 'poll-answers/' + pollAnswerId + '/add-respondent';
    return this.getMethod(url);
  }

  removeRespondentFromAnswer(pollAnswerId: number) {
    const url = 'poll-answers/' + pollAnswerId + '/remove-respondent';
    return this.getMethod(url);
  }

  isAnswerAlreadySelected(pollAnswerId: number) {
    const url = 'poll-answers/' + pollAnswerId + '/is-already-selected';
    return this.getMethod(url);
  }

  createPollAnswer(pollQuestionId: number, text: string) {
    const url = 'poll-answers/create';
    const body = {
      pollQuestionId: pollQuestionId,
      text: text
    };

    return this.postMethod(url, body);
  }
}
