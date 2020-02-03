import { Component, Input, AfterViewInit } from '@angular/core';
import { NgxSmartModalComponent, NgxSmartModalService } from 'ngx-smart-modal';
import { IInvitation } from 'src/app/interface/IInvitation';
import { EventService } from 'src/app/services/rest/event.service';

@Component({
  selector: 'app-view-request-modal',
  templateUrl: './view-request-modal.component.html',
  styleUrls: ['./view-request-modal.component.css']
})
export class ViewRequestModalComponent implements AfterViewInit {
  @Input() eventId;

  invitations: Array<IInvitation>;

  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private eventService: EventService
  ) {}

  ngAfterViewInit() {
    const invitationRequestModal = this.ngxSmartModalService.getModal('invitationRequestModal');
    invitationRequestModal.dismissable = false;

    invitationRequestModal.onOpen.subscribe((modal: NgxSmartModalComponent) => {
      this.eventService.getInvitationRequestsForEvent(this.eventId).subscribe(invitations => {
        this.invitations = invitations;
      });
    });

    invitationRequestModal.onClose.subscribe((modal: NgxSmartModalComponent) => {
      this.invitations = [];
    });
  }
}
