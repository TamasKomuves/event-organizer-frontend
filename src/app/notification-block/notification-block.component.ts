import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../services/user.service';

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
  text: string;
  result: string;
  isAccepted: number;
  isUserRequested: number;

  constructor(private userService: UserService) { }

  ngOnInit() {

    this.userService.getInvitationById(this.invitationId).subscribe(data => {
      this.isAccepted = data['isAccepted'];
      this.isUserRequested = data['isUserRequested'];
      this.sentDate = data['sentDate'];
      this.decisionDate = data['decisionDate'];

      this.text = this.initText();

      if (this.decisionDate != null) {
        if (this.isUserRequested == 1 && this.isAccepted == 1) {
          this.result = 'has been accepted';
        } else if (this.isUserRequested == 1) {
          this.result = 'has been declined';
        } else if (this.isAccepted == 1) {
          this.result = 'You accepted the invitation';
        } else {
          this.result = 'You declined the invitation';
        }
      } else if (this.isUserRequested == 1) {
        this.result = 'has been sent';
      }
    });
  }

  initText(): string {
    return !this.isUserRequested ? 'You have been invited to Football fans conference!' :
      'Your request for join Football fans conference';
  }

  isShowButtons(): boolean {
    return this.decisionDate == null && !this.isUserRequested;
  }
  
  acceptInvitation(): void {
  	this.userService.answerToInvitation(this.invitationId, 1).subscribe(data => {
  		
  	});
  }
  
  declineInvitation(): void {
  	this.userService.answerToInvitation(this.invitationId, 0).subscribe(data => {
  		
  	});
  }

}
