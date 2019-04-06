import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-invitation-request-block',
  templateUrl: './invitation-request-block.component.html',
  styleUrls: ['./invitation-request-block.component.css']
})
export class InvitationRequestBlockComponent implements OnInit {
  @Input() invitationId;

  nameAndEmail: string;
  isLoaded = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getInvitationById(this.invitationId).subscribe(invitation => {
      this.userService.getUserByEmail(invitation['userEmail']).subscribe(user => {
        this.nameAndEmail = user['firstName'] + ' ' + user['lastName'] + ' (' + user['email'] + ')';
        this.isLoaded = true;
      });
    });
  }

  declineRequest(): void {
    this.isLoaded = false;
    this.userService.answerToInvitation(this.invitationId, 0).subscribe(result => {});
  }

  acceptRequest(): void {
    this.isLoaded = false;
    this.userService.answerToInvitation(this.invitationId, 1).subscribe(result => {});
  }
}
