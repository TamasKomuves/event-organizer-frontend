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

  constructor(
    private userService: UserService,
    private router: Router,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private translate: TranslateService
  ) {}

  ngOnInit() {}

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
        console.log(sessionStorage.getItem('token'));
        this.spinner.hide();
      },
      error => {
        console.log(error);
        this.translate.get('login.invalid_data').subscribe(res => alert(res));
        this.isLoading = false;
        this.spinner.hide();
      }
    );
  }
}
