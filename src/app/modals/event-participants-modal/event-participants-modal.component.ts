import { Component, Input, AfterViewInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';

@Component({
  selector: 'app-event-participants-modal',
  templateUrl: './event-participants-modal.component.html',
  styleUrls: ['./event-participants-modal.component.css']
})
export class EventParticipantsModalComponent implements AfterViewInit {
  @Input() eventId;

  participants: any;

  constructor(private userService: UserService, private ngxSmartModalService: NgxSmartModalService) {}

  ngAfterViewInit() {
    const eventParticipantsModal = this.ngxSmartModalService.getModal('eventParticipantsModal');

    eventParticipantsModal.onOpen.subscribe((modal: NgxSmartModalComponent) => {
      this.userService.getEventParticipants(this.eventId).subscribe(participants => {
        this.participants = participants;
      });
    });

    eventParticipantsModal.onClose.subscribe((modal: NgxSmartModalComponent) => {
      this.participants = [];
    });
  }
}
