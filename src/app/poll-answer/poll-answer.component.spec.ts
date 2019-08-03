import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PollAnswerComponent } from './poll-answer.component';

describe('PollAnswerComponent', () => {
  let component: PollAnswerComponent;
  let fixture: ComponentFixture<PollAnswerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PollAnswerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PollAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
