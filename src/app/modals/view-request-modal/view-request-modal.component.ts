import { Component, Input, AfterViewInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { NgxSmartModalComponent, NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-view-request-modal',
  templateUrl: './view-request-modal.component.html',
  styleUrls: ['./view-request-modal.component.css']
})
export class ViewRequestModalComponent implements AfterViewInit {
  @Input() eventId;

  invitations: any;

  constructor(private userService: UserService, private ngxSmartModalService: NgxSmartModalService) {}

  ngAfterViewInit() {
    const invitationRequestModal = this.ngxSmartModalService.getModal('invitationRequestModal');

    invitationRequestModal.onOpen.subscribe((modal: NgxSmartModalComponent) => {
      this.userService.getInvitationRequestsForEvent(this.eventId).subscribe(invitations => {
        this.invitations = invitations;
      });
    });

    invitationRequestModal.onClose.subscribe((modal: NgxSmartModalComponent) => {
      this.invitations = [];
    });
  }
}
