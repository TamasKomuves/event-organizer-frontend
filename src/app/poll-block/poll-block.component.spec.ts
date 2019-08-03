import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PollBlockComponent } from './poll-block.component';

describe('PollBlockComponent', () => {
  let component: PollBlockComponent;
  let fixture: ComponentFixture<PollBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PollBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PollBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
