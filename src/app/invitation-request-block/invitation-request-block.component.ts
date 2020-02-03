import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../services/rest/user.service';
import { InvitationService } from '../services/rest/invitation.service';
import { WebsocketService } from '../services/websocket.service';
import { IInvitation } from '../interface/IInvitation';

@Component({
  selector: 'app-invitation-request-block',
  templateUrl: './invitation-request-block.component.html',
  styleUrls: ['./invitation-request-block.component.css']
})
export class InvitationRequestBlockComponent implements OnInit {
  @Input() invitationId;

  nameAndEmail: string;
  isLoaded = false;

  constructor(
    private userService: UserService,
    private invitationService: InvitationService,
    private websocketService: WebsocketService
  ) {}

  ngOnInit() {
    this.invitationService.getInvitationById(this.invitationId).subscribe(invitation => {
      this.userService.getUserByEmail(invitation.userEmail).subscribe(user => {
        this.nameAndEmail = user.firstName + ' ' + user.lastName + ' (' + user.email + ')';
        this.isLoaded = true;
      });
    });
  }

  declineRequest(): void {
    this.isLoaded = false;
    this.invitationService
      .answerToInvitation(this.invitationId, 0)
      .subscribe((savedInvitation: IInvitation) => {
        this.websocketService.send(
          '/socket-subscriber/send/invitation',
          JSON.stringify(savedInvitation)
        );
      });
  }

  acceptRequest(): void {
    this.isLoaded = false;
    this.invitationService
      .answerToInvitation(this.invitationId, 1)
      .subscribe((savedInvitation: IInvitation) => {
        this.websocketService.send(
          '/socket-subscriber/send/invitation',
          JSON.stringify(savedInvitation)
        );
      });
  }
}
