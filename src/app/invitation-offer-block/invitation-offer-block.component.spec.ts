import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationOfferBlockComponent } from './invitation-offer-block.component';

describe('InvitationOfferBlockComponent', () => {
  let component: InvitationOfferBlockComponent;
  let fixture: ComponentFixture<InvitationOfferBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InvitationOfferBlockComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationOfferBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
