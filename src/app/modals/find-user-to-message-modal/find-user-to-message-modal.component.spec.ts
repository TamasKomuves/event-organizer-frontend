import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindUserToMessageModalComponent } from './find-user-to-message-modal.component';

describe('FindUserToMessageModalComponent', () => {
  let component: FindUserToMessageModalComponent;
  let fixture: ComponentFixture<FindUserToMessageModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindUserToMessageModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindUserToMessageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
