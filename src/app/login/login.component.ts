import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { MessageService } from '../services/message.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;

  constructor(
    private userService: UserService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {}

  login(): void {
    this.userService.login(this.email, this.password).subscribe(
      data => {
        if (data['result'] === 'success') {
          this.router.navigateByUrl('/home');
          this.messageService.sendLoggedInMessage(true);
        } else {
          alert('Invalid data');
          return;
        }
      },
      error => {
        console.log(error);
      }
    );
  }
}
