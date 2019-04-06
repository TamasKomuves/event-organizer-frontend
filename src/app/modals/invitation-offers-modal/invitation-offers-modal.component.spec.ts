import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationOffersModalComponent } from './invitation-offers-modal.component';

describe('InvitationOffersModalComponent', () => {
  let component: InvitationOffersModalComponent;
  let fixture: ComponentFixture<InvitationOffersModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InvitationOffersModalComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationOffersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
