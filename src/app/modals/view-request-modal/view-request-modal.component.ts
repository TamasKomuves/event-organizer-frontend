import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-view-request-modal',
  templateUrl: './view-request-modal.component.html',
  styleUrls: ['./view-request-modal.component.css']
})
export class ViewRequestModalComponent implements OnInit {
  @Input() eventId;

  invitations: any;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getInvitationRequestsForEvent(this.eventId).subscribe(invitations => {
      this.invitations = invitations;
    });
  }
}
