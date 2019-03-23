import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-show-events',
  templateUrl: './show-events.component.html',
  styleUrls: ['./show-events.component.css']
})
export class ShowEventsComponent implements OnInit {

  events: any;
  eventTypes: any;
  selectedEventType: string;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getAllEvents().subscribe(data => {
      this.events = data;
    });

    this.userService.getAllEventType().subscribe(eventTypes => {
      this.eventTypes = eventTypes;
    });
  }

  showEventsByType(): void {
    if (this.selectedEventType === 'all') {
      this.userService.getAllEvents().subscribe(events => {
        this.events = events;
      });
    } else {
      this.userService.getEventsByType(this.selectedEventType).subscribe(events => {
        this.events = events;
      });
    }
  }
}
