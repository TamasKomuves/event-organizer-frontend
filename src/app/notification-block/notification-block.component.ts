import { Component, OnInit, Input } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { IInvitation } from '../interface/IInvitation';
import { EventService } from '../services/rest/event.service';
import { InvitationService } from '../services/rest/invitation.service';

@Component({
  selector: 'app-notification-block',
  templateUrl: './notification-block.component.html',
  styleUrls: ['./notification-block.component.css']
})
export class NotificationBlockComponent implements OnInit {
  @Input() invitationId;

  eventId: string;
  sentDate: string;
  decisionDate: string;
  dateToShow: string;
  text: string;
  result: string;
  isAccepted: number;
  isUserRequested: number;
  isShowButtons = false;
  eventName: string;
  spinnerName: string;

  constructor(
    private spinner: NgxSpinnerService,
    private eventService: EventService,
    private invitationService: InvitationService
  ) {}

  ngOnInit() {
    this.initNotification();
  }

  initNotification(): void {
    this.spinnerName = 'mySpinner' + this.invitationId;
    this.spinner.show(this.spinnerName);
    this.invitationService.getInvitationById(this.invitationId).subscribe(invitation => {
      this.isAccepted = invitation.isAccepted;
      this.isUserRequested = invitation.isUserRequested;
      this.sentDate = invitation.sentDate;
      this.decisionDate = invitation.decisionDate;
      this.dateToShow = this.getDateToShowFromInvitation(invitation);

      this.eventService.getEventById(invitation.eventId).subscribe(event => {
        this.eventName = event.name;
        this.text = this.initText();
        this.result = this.calculateResult();
        this.isShowButtons = this.shouldShowButtons();
        this.spinner.hide(this.spinnerName);
      });
    });
  }

  getDateToShowFromInvitation(invitation: IInvitation): string {
    return invitation.decisionDate !== null ? invitation.decisionDate : invitation.sentDate;
  }

  initText(): string {
    return !this.isUserRequested ? 'notifications.invitation_text' : 'notifications.request_text';
  }

  calculateResult(): string {
    let result = '';

    if (this.decisionDate !== null) {
      if (this.isUserRequested === 1 && this.isAccepted === 1) {
        result = 'notifications.request_accepted';
      } else if (this.isUserRequested === 1) {
        result = 'notifications.request_declined';
      } else if (this.isAccepted === 1) {
        result = 'notifications.invitation_accepted';
      } else {
        result = 'notifications.invitation_declined';
      }
    } else if (this.isUserRequested === 1) {
      result = 'notifications.request_no_answer_yet';
    }
    return result;
  }

  shouldShowButtons(): boolean {
    return this.decisionDate === null && this.isUserRequested === 0;
  }

  acceptInvitation(): void {
    this.isShowButtons = false;
    this.invitationService.answerToInvitation(this.invitationId, 1).subscribe(data => {
      this.initNotification();
    });
  }

  declineInvitation(): void {
    this.isShowButtons = false;
    this.invitationService.answerToInvitation(this.invitationId, 0).subscribe(data => {
      this.initNotification();
    });
  }
}
