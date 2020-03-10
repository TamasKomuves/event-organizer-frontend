import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindUserToMessageModalComponent } from './find-user-to-message-modal.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { ChatPageComponent } from 'src/app/chat-page/chat-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'src/environments/environment';
import { IUser } from 'src/app/interface/IUser';
import { Router } from '@angular/router';

describe('FindUserToMessageModalComponent', () => {
  const apiUrl = environment.apiUrl;
  let component: FindUserToMessageModalComponent;
  let fixture: ComponentFixture<FindUserToMessageModalComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FindUserToMessageModalComponent, ChatPageComponent],
      imports: [
        TranslateModule.forRoot(),
        FormsModule,
        HttpClientTestingModule,
        NgxSmartModalModule.forRoot(),
        RouterTestingModule.withRoutes([{ path: 'chat-page', component: ChatPageComponent }])
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindUserToMessageModalComponent);
    component = fixture.componentInstance;

    httpMock = TestBed.get(HttpTestingController);
    router = TestBed.get(Router);
  });

  it('should create', () => {
    component.ngOnInit();

    const req1 = httpMock.expectOne(apiUrl + 'users/all');
    expect(req1.request.method).toBe('GET');
    req1.flush([{}, {}, {}, {}]);
    expect(component.allUsers.length).toBe(4);
  });

  it('should update the suggestedUsers list', () => {
    component.searchedName = 'bor';
    component.suggestedUsers = new Array<IUser>();
    const user1: IUser = {
      addressId: 1,
      firstName: 'Borbala',
      lastName: 'Kera',
      email: 'user1@gmail.com'
    };
    const user2: IUser = {
      addressId: 2,
      firstName: 'Jitsoo',
      lastName: 'Ralbo ra',
      email: 'user2@gmail.com'
    };
    const user3: IUser = {
      addressId: 3,
      firstName: 'Ron',
      lastName: 'Grizzly',
      email: 'user3@gmail.com'
    };
    const user4: IUser = {
      addressId: 3,
      firstName: 'Ron',
      lastName: 'Grizzly',
      email: 'kaBORto@gmail.com'
    };
    component.allUsers = new Array();
    component.allUsers.push(user1);
    component.allUsers.push(user2);
    component.allUsers.push(user3);
    component.allUsers.push(user4);

    component.searchedNameChanged();

    expect(component.suggestedUsers.length).toBe(3);
  });

  it('should update the suggestedUsers list', () => {
    const user1Email = 'user1@gmail.com';
    spyOn(router, 'navigate');

    component.openChatpage(user1Email);

    expect(router.navigate).toHaveBeenCalledWith(['/chat-page'], {
      queryParams: { email: user1Email }
    });
  });
});
