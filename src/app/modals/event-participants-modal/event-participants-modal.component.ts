import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-event-participants-modal',
  templateUrl: './event-participants-modal.component.html',
  styleUrls: ['./event-participants-modal.component.css']
})
export class EventParticipantsModalComponent implements OnInit {
  @Input() eventId;

  participants: any;
  nameAndEmail: any;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getEventParticipants(this.eventId).subscribe(participants => {
      this.participants = participants;
    });
  }
}
