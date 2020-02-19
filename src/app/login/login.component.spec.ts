import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'src/environments/environment';
import { MessageService } from '../services/message.service';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  const apiUrl = environment.apiUrl;
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let translate: TranslateService;
  let spinner: NgxSpinnerService;
  let httpMock: HttpTestingController;
  let router: Router;
  let messageService: MessageService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        FormsModule,
        NgxSpinnerModule,
        RouterTestingModule.withRoutes([{ path: 'home', component: LoginComponent }])
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    translate = TestBed.get(TranslateService);
    spinner = TestBed.get(NgxSpinnerService);
    httpMock = TestBed.get(HttpTestingController);
    router = TestBed.get(Router);
    messageService = TestBed.get(MessageService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set selected language variable to hu on init', () => {
    translate.currentLang = 'hu';

    component.ngOnInit();

    expect(component.selectedLanguage).toBe('hu');
  });

  it('should change language to selectedLanguage', () => {
    translate.currentLang = 'en';
    component.selectedLanguage = 'hu';

    component.changeLanguage();

    expect(component.selectedLanguage).toBe('hu');
  });

  it('should login successfully', () => {
    component.email = 'user@gmail.com';
    component.password = 'secretPassword';
    spyOn(spinner, 'show');
    spyOn(spinner, 'hide');
    spyOn(router, 'navigateByUrl');
    spyOn(messageService, 'sendLoggedInMessage');
    spyOn(sessionStorage, 'setItem');

    component.login();

    expect(component.isLoading).toBeTruthy();
    expect(spinner.show).toHaveBeenCalled();
    const req = httpMock.expectOne(apiUrl + 'public/users/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.email).toBe('user@gmail.com');
    expect(req.request.body.password).toBe('secretPassword');

    req.flush({ token: 'token12345' });
    expect(router.navigateByUrl).toHaveBeenCalledWith('/home');
    expect(messageService.sendLoggedInMessage).toHaveBeenCalledWith(true);
    expect(spinner.hide).toHaveBeenCalled();
    expect(component.isLoading).toBeFalsy();
    expect(sessionStorage.setItem).toHaveBeenCalledWith('token', 'token12345');
    expect(sessionStorage.setItem).toHaveBeenCalledWith('userEmail', 'user@gmail.com');
  });

  it('should fail the login because invalid credetials', () => {
    spyOn(spinner, 'show');
    spyOn(spinner, 'hide');
    spyOn(window, 'alert');

    component.login();

    expect(component.isLoading).toBeTruthy();
    expect(spinner.show).toHaveBeenCalled();
    const req = httpMock.expectOne(apiUrl + 'public/users/login');
    expect(req.request.method).toBe('POST');

    req.error(new ErrorEvent('invalid login and/or password'));
    expect(spinner.hide).toHaveBeenCalled();
    expect(component.isLoading).toBeFalsy();
  });
});
