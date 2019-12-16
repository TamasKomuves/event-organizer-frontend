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

  participants: Array<IUser>;

  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private eventService: EventService
  ) {}

  ngAfterViewInit() {
    const eventParticipantsModal = this.ngxSmartModalService.getModal('eventParticipantsModal');
    eventParticipantsModal.dismissable = false;

    eventParticipantsModal.onOpen.subscribe((modal: NgxSmartModalComponent) => {
      this.eventService.getEventParticipants(this.eventId).subscribe(participants => {
        this.participants = participants;
      });
    });

    eventParticipantsModal.onClose.subscribe((modal: NgxSmartModalComponent) => {
      this.participants = [];
    });
  }
}
