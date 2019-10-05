import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { IUser } from '../interface/IUser';

@Component({
  selector: 'app-messages-container-block',
  templateUrl: './messages-container-block.component.html',
  styleUrls: ['./messages-container-block.component.css']
})
export class MessagesContainerBlockComponent implements OnInit {
  @Input() chatMessage: any;

  partner: IUser;

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {
    this.userService.getUserByEmail(this.chatMessage.partnerEmail).subscribe(user => {
      this.partner = user;
    });
  }

  openChatPage(email: string): void {
    this.router.navigate(['/chat-page'], { queryParams: { email: email } });
  }
}
