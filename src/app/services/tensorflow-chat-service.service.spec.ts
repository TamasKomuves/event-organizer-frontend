import { TestBed } from '@angular/core/testing';

import { TensorflowChatServiceService } from './tensorflow-chat-service.service';

describe('TensorflowChatServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TensorflowChatServiceService = TestBed.get(TensorflowChatServiceService);
    expect(service).toBeTruthy();
  });
});
