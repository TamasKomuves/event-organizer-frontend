import { Component, Input, AfterViewInit } from '@angular/core';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { IInvitation } from 'src/app/interface/IInvitation';
import { EventService } from 'src/app/services/rest/event.service';

@Component({
  selector: 'app-invitation-offers-modal',
  templateUrl: './invitation-offers-modal.component.html',
  styleUrls: ['./invitation-offers-modal.component.css']
})
export class InvitationOffersModalComponent implements AfterViewInit {
  @Input() eventId;

  invitations: Array<IInvitation>;

  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private eventService: EventService
  ) {}

  ngAfterViewInit() {
    const invitationOfferModal = this.ngxSmartModalService.getModal('invitationOffersModal');
    invitationOfferModal.dismissable = false;

    invitationOfferModal.onOpen.subscribe((modal: NgxSmartModalComponent) => {
      this.eventService.getInvitationOffersForEvent(this.eventId).subscribe(invitations => {
        this.invitations = invitations;
      });
    });

    invitationOfferModal.onClose.subscribe((modal: NgxSmartModalComponent) => {
      this.invitations = [];
    });
  }
}
