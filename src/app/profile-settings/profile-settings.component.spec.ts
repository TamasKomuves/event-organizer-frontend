import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSettingsComponent } from './profile-settings.component';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from '../login/login.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { IPasswordChange } from '../interface/IPasswordChange';

describe('ProfileSettingsComponent', () => {
  const apiUrl = environment.apiUrl;
  let component: ProfileSettingsComponent;
  let fixture: ComponentFixture<ProfileSettingsComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileSettingsComponent, LoginComponent],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        FormsModule,
        RouterTestingModule.withRoutes([{ path: 'home', component: LoginComponent }]),
        NgxSpinnerModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    httpMock = TestBed.get(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should save address info', () => {
    component.country = 'Hungary';
    component.city = 'Szeged';
    component.street = 'Random st.';
    component.streetNumber = '75';
    spyOn(window, 'alert');

    component.saveAddress();

    const requests = httpMock.match(apiUrl + 'users/current');
    expect(requests.length).toBe(2);
    const req1 = requests[1];
    req1.flush({ addressId: 15 });
    const req2 = httpMock.expectOne(apiUrl + 'addresses/update/15/Hungary/Szeged/Random st./75');
    expect(req2.request.method).toBe('GET');
    req2.flush({ result: 'success' });
    expect(window.alert).toHaveBeenCalledWith('popup.settings.address_updated');
  });

  it('should change the password', () => {
    component.oldPassword = 'oldPassword';
    component.newPassword = 'newPassword';
    component.newPasswordAgain = 'newPassword';
    spyOn(window, 'alert');
    const expectedBody: IPasswordChange = {
      oldPassword: 'oldPassword',
      password: 'newPassword',
      passwordAgain: 'newPassword'
    };

    component.changePassword();

    const req1 = httpMock.expectOne(apiUrl + 'users/change-password');
    expect(req1.request.method).toBe('PUT');
    expect(req1.request.body).toEqual(expectedBody);
    req1.flush({});
    expect(window.alert).toHaveBeenCalledWith('popup.settings.password_updated');
    expect(component.oldPassword).toBe('');
    expect(component.newPassword).toBe('');
    expect(component.newPasswordAgain).toBe('');
  });

  it('should fail the passwordchange because of mismatching passwords', () => {
    component.oldPassword = 'oldPassword';
    component.newPassword = 'newPassword';
    component.newPasswordAgain = 'mismatchingNewPassword';
    spyOn(window, 'alert');

    component.changePassword();

    expect(window.alert).toHaveBeenCalledWith('popup.settings.mismatching_passwords');
    httpMock.expectNone(apiUrl + 'users/change-password');
  });

  it('should fail the passwordchange because of empty field', () => {
    component.oldPassword = 'oldPassword';
    component.newPassword = '';
    component.newPasswordAgain = 'mismatchingNewPassword';
    spyOn(window, 'alert');

    component.changePassword();

    expect(window.alert).toHaveBeenCalledWith('popup.settings.fill_in_all_fields');
    httpMock.expectNone(apiUrl + 'users/change-password');
  });

  it('should delete the profile', () => {
    spyOn(window, 'confirm')
      .withArgs('popup.settings.confirm_profile_deletion')
      .and.returnValue(true);

    component.deleteProfile();

    const req1 = httpMock.expectOne(apiUrl + 'users/delete');
    expect(req1.request.method).toBe('DELETE');
  });
});
