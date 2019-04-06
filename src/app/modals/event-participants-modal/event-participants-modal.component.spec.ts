import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventParticipantsModalComponent } from './event-participants-modal.component';

describe('EventParticipantsModalComponent', () => {
  let component: EventParticipantsModalComponent;
  let fixture: ComponentFixture<EventParticipantsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EventParticipantsModalComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventParticipantsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
