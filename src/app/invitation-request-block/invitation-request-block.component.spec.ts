import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationRequestBlockComponent } from './invitation-request-block.component';

describe('InvitationRequestBlockComponent', () => {
  let component: InvitationRequestBlockComponent;
  let fixture: ComponentFixture<InvitationRequestBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InvitationRequestBlockComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationRequestBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
