import { Component, OnInit } from '@angular/core';
import { MessageService } from '../services/message.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { WebsocketService } from '../services/websocket.service';
import { IUser } from '../interface/IUser';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean;
  messageCounter = 0;
  notificationCounter = 0;

  constructor(
    private messageService: MessageService,
    private userService: UserService,
    private router: Router,
    private websocketService: WebsocketService
  ) {}

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(
      (user: IUser) => {
        this.isLoggedIn = true;
        this.websocketService.connect(
          '/socket-publisher/invitation-counter/' + user.email,
          socketMessage => {
            this.notificationCounter = Number(socketMessage.body);
          }
        );
      },
      error => {
        this.isLoggedIn = false;
      }
    );
    this.userService.getNotSeenNotificationCount().subscribe((result: number) => {
      this.notificationCounter = result;
    });

    this.messageService.getLoggedInMessage().subscribe(message => {
      this.isLoggedIn = message.isLoggedIn;
      if (message.isLoggedIn) {
        this.userService.getNotSeenNotificationCount().subscribe((result: number) => {
          this.notificationCounter = result;
        });
      }
    });
  }

  logout(): void {
    this.router.navigateByUrl('/login');
    sessionStorage.setItem('token', '');
    sessionStorage.setItem('userEmail', '');
    this.messageService.sendLoggedInMessage(false);
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
