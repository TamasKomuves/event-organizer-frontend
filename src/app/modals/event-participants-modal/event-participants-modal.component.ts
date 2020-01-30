import { Component, Input, AfterViewInit } from '@angular/core';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { IUser } from 'src/app/interface/IUser';
import { EventService } from 'src/app/services/rest/event.service';

@Component({
  selector: 'app-event-participants-modal',
  templateUrl: './event-participants-modal.component.html',
  styleUrls: ['./event-participants-modal.component.css']
})
export class EventParticipantsModalComponent implements AfterViewInit {
  @Input() eventId;
  @Input() organizerEmail;

  participants: Array<IUser>;
  isCurrentUserOrganizer = false;

  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private eventService: EventService
  ) {}

  ngAfterViewInit() {
    const eventParticipantsModal = this.ngxSmartModalService.getModal('eventParticipantsModal');
    eventParticipantsModal.dismissable = false;

    eventParticipantsModal.onOpen.subscribe((modal: NgxSmartModalComponent) => {
      this.isCurrentUserOrganizer = sessionStorage.getItem('userEmail') === this.organizerEmail;
      this.eventService.getEventParticipants(this.eventId).subscribe(participants => {
        this.participants = participants;
      });
    });

    eventParticipantsModal.onClose.subscribe((modal: NgxSmartModalComponent) => {
      this.participants = [];
    });
  }

  removeParticipant(email: string): void {
    this.eventService.deleteParticipant(this.eventId, email).subscribe(() => {
      this.participants = [];
      this.eventService.getEventParticipants(this.eventId).subscribe(participants => {
        this.participants = participants;
      });
    });
  }
}
