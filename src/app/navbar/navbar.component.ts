import { Component, OnInit } from '@angular/core';
import { MessageService } from '../services/message.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean;

  constructor(
    private messageService: MessageService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(
      data => {
        this.isLoggedIn = true;
      },
      error => {
        this.isLoggedIn = false;
      }
    );
    this.messageService.getLoggedInMessage().subscribe(message => {
      this.isLoggedIn = message.isLoggedIn;
    });
  }

  logout(): void {
    this.userService.logout().subscribe(data => {
      this.router.navigateByUrl('/login');
      this.messageService.sendLoggedInMessage(false);
    });
  }

  showHome(): void {
    this.router.navigateByUrl('/home');
  }

  showEvents(): void {
    this.router.navigateByUrl('/show-events');
  }

  showCreateEvent(): void {
    this.router.navigateByUrl('/create-event');
  }

  showNotifications(): void {
    this.router.navigateByUrl('/notifications');
  }

  showSettings(): void {
    this.router.navigateByUrl('/profile-settings');
  }

  showMessagesContainer(): void {
    this.router.navigateByUrl('/messages-container');
  }
}
