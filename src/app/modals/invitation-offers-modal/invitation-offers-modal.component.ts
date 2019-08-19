import { Component, Input, AfterViewInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { IInvitation } from 'src/app/interface/IInvitation';

@Component({
  selector: 'app-invitation-offers-modal',
  templateUrl: './invitation-offers-modal.component.html',
  styleUrls: ['./invitation-offers-modal.component.css']
})
export class InvitationOffersModalComponent implements AfterViewInit {
  @Input() eventId;

  invitations: Array<IInvitation>;

  constructor(private userService: UserService, private ngxSmartModalService: NgxSmartModalService) {}

  ngAfterViewInit() {
    const invitationOfferModal = this.ngxSmartModalService.getModal('invitationOffersModal');

    invitationOfferModal.onOpen.subscribe((modal: NgxSmartModalComponent) => {
      this.userService.getInvitationOffersForEvent(this.eventId).subscribe(invitations => {
        this.invitations = invitations;
      });
    });

    invitationOfferModal.onClose.subscribe((modal: NgxSmartModalComponent) => {
      this.invitations = [];
    });
  }
}
