import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationOfferBlockComponent } from './invitation-offer-block.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';

describe('InvitationOfferBlockComponent', () => {
  const apiUrl = environment.apiUrl;
  let component: InvitationOfferBlockComponent;
  let fixture: ComponentFixture<InvitationOfferBlockComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InvitationOfferBlockComponent, InvitationOfferBlockComponent],
      imports: [TranslateModule.forRoot(), FormsModule, HttpClientTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationOfferBlockComponent);
    component = fixture.componentInstance;

    httpMock = TestBed.get(HttpTestingController);

    component.invitationId = 7;
  });

  it('should create', () => {
    component.ngOnInit();

    const req1 = httpMock.expectOne(apiUrl + 'invitations/7');
    expect(req1.request.method).toBe('GET');
    req1.flush({ userEmail: 'user@gmail.com' });
    const req2 = httpMock.expectOne(apiUrl + 'users/user@gmail.com');
    expect(req2.request.method).toBe('GET');
    req2.flush({ firstName: 'Iligy', lastName: 'Nber', email: 'user@gmail.com' });
    expect(component.nameAndEmail).toBe('Iligy Nber (user@gmail.com)');
    expect(component.isLoaded).toBeTruthy();
  });

  it('should undo the invitation', () => {
    component.isLoaded = true;

    component.undoInvitation();

    expect(component.isLoaded).toBeFalsy();
    const req1 = httpMock.expectOne(apiUrl + 'invitations/7/delete');
    expect(req1.request.method).toBe('GET');
  });
});
