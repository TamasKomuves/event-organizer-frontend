import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../services/rest/user.service';
import { InvitationService } from '../services/rest/invitation.service';

@Component({
  selector: 'app-invitation-offer-block',
  templateUrl: './invitation-offer-block.component.html',
  styleUrls: ['./invitation-offer-block.component.css']
})
export class InvitationOfferBlockComponent implements OnInit {
  @Input() invitationId;

  nameAndEmail: string;
  isLoaded = false;

  constructor(private userService: UserService, private invitationService: InvitationService) {}

  ngOnInit() {
    this.invitationService.getInvitationById(this.invitationId).subscribe(invitation => {
      this.userService.getUserByEmail(invitation.userEmail).subscribe(user => {
        this.nameAndEmail = user.firstName + ' ' + user.lastName + ' (' + user.email + ')';
        this.isLoaded = true;
      });
    });
  }

  undoInvitation(): void {
    this.isLoaded = false;
    this.invitationService.deleteInvitation(this.invitationId).subscribe(result => {});
  }
}
