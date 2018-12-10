import { Component, OnInit } from '@angular/core';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isLoggedIn: boolean;

  constructor(private messageService: MessageService) { }

  ngOnInit() {
    this.isLoggedIn = false;
  	this.messageService.getLoggedInMessage().subscribe(message => {
      this.isLoggedIn = message.isLoggedIn;
    });
  }

  logout(): void {
    this.messageService.sendLoggedInMessage(true);
  }

}
