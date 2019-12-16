import { TestBed } from '@angular/core/testing';

import { PollAnswerService } from './poll-answer.service';

describe('PollAnswerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PollAnswerService = TestBed.get(PollAnswerService);
    expect(service).toBeTruthy();
  });
});
