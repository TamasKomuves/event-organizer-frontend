import { TestBed } from '@angular/core/testing';

import { PollQuestionService } from './poll-question.service';

describe('PollQuestionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PollQuestionService = TestBed.get(PollQuestionService);
    expect(service).toBeTruthy();
  });
});
