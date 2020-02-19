import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationComponent } from './registration.component';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { LoginComponent } from '../login/login.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { Router } from '@angular/router';

describe('RegistrationComponent', () => {
  const apiUrl = environment.apiUrl;
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrationComponent, LoginComponent],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        FormsModule,
        NgxSpinnerModule,
        RouterTestingModule.withRoutes([{ path: 'login', component: LoginComponent }])
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    httpMock = TestBed.get(HttpTestingController);
    router = TestBed.get(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not register with mismatching passwords', () => {
    component.password = 'secretPassword';
    component.passwordAgain = 'notMatchinPassword';
    spyOn(window, 'alert');

    component.register();

    httpMock.expectNone(apiUrl + 'public/users/registration');
    expect(window.alert).toHaveBeenCalledWith('popup.registration.mismatching_passwords');
  });

  it('should not register if any field is undefined', () => {
    component.password = 'secretPassword';
    component.passwordAgain = 'secretPassword';
    spyOn(window, 'alert');

    component.register();

    httpMock.expectNone(apiUrl + 'public/users/registration');
    expect(window.alert).toHaveBeenCalledWith('popup.registration.fill_in_all_fields');
  });

  it('should register and navigate to login', () => {
    component.password = 'secretPassword';
    component.passwordAgain = 'secretPassword';
    component.email = 'email';
    component.firstname = 'firstname';
    component.lastname = 'lastname';
    component.country = 'country';
    component.city = 'city';
    component.street = 'street';
    component.streetNumber = 'streetNumber';
    spyOn(window, 'alert');
    spyOn(router, 'navigateByUrl');

    component.register();

    const req = httpMock.expectOne(apiUrl + 'public/users/registration');
    req.flush({ result: 'success' });
    expect(window.alert).toHaveBeenCalledWith('popup.registration.success');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });
});
