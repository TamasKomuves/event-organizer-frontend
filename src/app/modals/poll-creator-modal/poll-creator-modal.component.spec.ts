import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PollCreatorModalComponent } from './poll-creator-modal.component';

describe('PollCreatorModalComponent', () => {
  let component: PollCreatorModalComponent;
  let fixture: ComponentFixture<PollCreatorModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PollCreatorModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PollCreatorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
