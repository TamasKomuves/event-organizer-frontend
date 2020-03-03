import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationRequestBlockComponent } from './invitation-request-block.component';
import { WebsocketService } from '../services/websocket.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

describe('InvitationRequestBlockComponent', () => {
  const apiUrl = environment.apiUrl;
  let component: InvitationRequestBlockComponent;
  let fixture: ComponentFixture<InvitationRequestBlockComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InvitationRequestBlockComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [WebsocketService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationRequestBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    httpMock = TestBed.get(HttpTestingController);

    component.invitationId = 6;
  });

  it('should create', () => {
    component.ngOnInit();

    const req1 = httpMock.expectOne(apiUrl + 'invitations/6');
    expect(req1.request.method).toEqual('GET');
    req1.flush({ userEmail: 'user@gmail.com' });
    const req2 = httpMock.expectOne(apiUrl + 'users/user@gmail.com');
    expect(req2.request.method).toEqual('GET');
    req2.flush({ firstName: 'firstName', lastName: 'lastName', email: 'user@gmail.com' });
    expect(component.isLoaded).toBeTruthy();
    expect(component.nameAndEmail).toBe('firstName lastName (user@gmail.com)');
    expect(component).toBeTruthy();
  });

  it('should decline the invitation request', () => {
    component.declineRequest();

    expect(component.isLoaded).toBeFalsy();
    const req = httpMock.expectOne(apiUrl + 'invitations/6/answer/0');
    expect(req.request.method).toEqual('GET');
  });

  it('should accept the invitation request', () => {
    component.acceptRequest();

    expect(component.isLoaded).toBeFalsy();
    const req = httpMock.expectOne(apiUrl + 'invitations/6/answer/1');
    expect(req.request.method).toEqual('GET');
  });
});
