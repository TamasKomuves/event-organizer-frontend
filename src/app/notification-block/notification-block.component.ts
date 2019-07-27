import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';

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

  constructor(private userService: UserService, private spinner: NgxSpinnerService) {}

  ngOnInit() {
    this.initNotification();
  }

  initNotification(): void {
    this.spinnerName = 'mySpinner' + this.invitationId;
    this.spinner.show(this.spinnerName);
    this.userService.getInvitationById(this.invitationId).subscribe(invitation => {
      this.isAccepted = invitation['isAccepted'];
      this.isUserRequested = invitation['isUserRequested'];
      this.sentDate = invitation['sentDate'];
      this.decisionDate = invitation['decisionDate'];
      this.dateToShow = this.getDateToShowFromInvitation(invitation);

      this.userService.getEventById(invitation['eventId']).subscribe(event => {
        this.eventName = event['name'];
        this.text = this.initText();
        this.result = this.calculateResult();
        this.isShowButtons = this.shouldShowButtons();
        this.spinner.hide(this.spinnerName);
      });
    });
  }

  getDateToShowFromInvitation(invitation: any): string {
    return invitation['decisionDate'] !== null ? invitation['decisionDate'] : invitation['sentDate'];
  }

  initText(): string {
    return !this.isUserRequested
      ? 'You have been invited to ' + this.eventName + '!'
      : 'Your request for join ' + this.eventName;
  }

  calculateResult(): string {
    let result = '';

    if (this.decisionDate !== null) {
      if (this.isUserRequested === 1 && this.isAccepted === 1) {
        result = 'has been accepted';
      } else if (this.isUserRequested === 1) {
        result = 'has been declined';
      } else if (this.isAccepted === 1) {
        result = 'You accepted the invitation';
      } else {
        result = 'You declined the invitation';
      }
    } else if (this.isUserRequested === 1) {
      result = 'has been sent';
    }
    return result;
  }

  shouldShowButtons(): boolean {
    return this.decisionDate === null && this.isUserRequested === 0;
  }

  acceptInvitation(): void {
    this.isShowButtons = false;
    this.userService.answerToInvitation(this.invitationId, 1).subscribe(data => {
      this.initNotification();
    });
  }

  declineInvitation(): void {
    this.isShowButtons = false;
    this.userService.answerToInvitation(this.invitationId, 0).subscribe(data => {
      this.initNotification();
    });
  }
}
