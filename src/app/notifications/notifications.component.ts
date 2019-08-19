import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  invitations: any;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(currentUser => {
      this.userService.getInvitationsForUser(currentUser.email).subscribe(invitations => {
        this.invitations = invitations;
        this.invitations.sort((a, b) => this.dateToShow(b).localeCompare(this.dateToShow(a)));
      });
    });
  }

  dateToShow(invitation: any): string {
    return invitation['decisionDate'] !== null ? invitation['decisionDate'] : invitation['sentDate'];
  }
}
