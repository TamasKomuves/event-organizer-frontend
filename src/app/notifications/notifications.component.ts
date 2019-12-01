import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../services/user.service';
import { WebsocketService } from '../services/websocket.service';
import { IInvitation } from '../interface/IInvitation';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  invitations: Array<IInvitation> = new Array();

  constructor(private userService: UserService, private websocketService: WebsocketService) {}

  ngOnInit() {
    const userEmail: string = sessionStorage.getItem('userEmail');
    this.userService
      .getInvitationsForUser(userEmail)
      .subscribe((invitations: Array<IInvitation>) => {
        this.invitations = invitations;
        this.invitations.sort((a, b) => this.dateToShow(b).localeCompare(this.dateToShow(a)));
      });

    this.userService.updateAllInvitationToAlreadySeen().subscribe(() => {
      this.websocketService.connect(
        '/socket-publisher/new-invitations/' + userEmail,
        socketMessage => {
          const invitation: IInvitation = JSON.parse(socketMessage.body);
          this.invitations.unshift(invitation);
        },
        { messageTarget: '/socket-subscriber/send/invitation/update-counter', message: userEmail }
      );
    });
  }

  ngOnDestroy() {
    const userEmail: string = sessionStorage.getItem('userEmail');
    this.websocketService.unsubscribe('/socket-publisher/new-invitations/' + userEmail);
  }

  dateToShow(invitation: IInvitation): string {
    return invitation.decisionDate !== null ? invitation.decisionDate : invitation.sentDate;
  }
}
