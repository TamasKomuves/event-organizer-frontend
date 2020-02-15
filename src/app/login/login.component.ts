import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/rest/user.service';
import { MessageService } from '../services/message.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  isLoading = false;
  languages = ['hu', 'en'];
  selectedLanguage = this.languages[0];

  constructor(
    private userService: UserService,
    private router: Router,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.selectedLanguage = this.translate.currentLang;
  }

  login(): void {
    this.spinner.show();
    this.isLoading = true;
    this.userService.login(this.email, this.password).subscribe(
      result => {
        sessionStorage.setItem('token', result['token']);
        sessionStorage.setItem('userEmail', this.email);
        this.router.navigateByUrl('/home');
        this.messageService.sendLoggedInMessage(true);
        this.isLoading = false;
        this.spinner.hide();
      },
      error => {
        if (error.error.message === 'invalid login and/or password') {
          this.translate.get('popup.login.invalid_data').subscribe(text => alert(text));
        } else if (error.error.message === 'not activated') {
          this.translate.get('popup.login.not_activated').subscribe(text => {
            alert(text);
          });
        } else {
          console.log(error);
        }
        this.isLoading = false;
        this.spinner.hide();
      }
    );
  }

  changeLanguage(): void {
    this.translate.use(this.selectedLanguage);
  }
}
