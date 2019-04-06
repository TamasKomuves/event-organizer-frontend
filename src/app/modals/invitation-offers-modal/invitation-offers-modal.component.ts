import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-invitation-offers-modal',
  templateUrl: './invitation-offers-modal.component.html',
  styleUrls: ['./invitation-offers-modal.component.css']
})
export class InvitationOffersModalComponent implements OnInit {
  @Input() eventId;

  invitations: any;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getInvitationOffersForEvent(this.eventId).subscribe(invitations => {
      this.invitations = invitations;
    });
  }
}
