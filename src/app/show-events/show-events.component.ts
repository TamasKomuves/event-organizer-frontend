import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { IEvent } from '../interface/IEvent';
import { IUser } from '../interface/IUser';

@Component({
  selector: 'app-show-events',
  templateUrl: './show-events.component.html',
  styleUrls: ['./show-events.component.css']
})
export class ShowEventsComponent implements OnInit {
  events: Array<IEvent>;
  eventsToShow: Array<IEvent>;
  eventTypes: any;
  selectedEventType = 'all';
  lastSelectedEventType: string;
  isShowOnlyEventsWhereParticipate = false;
  isShowOnlyPublicEvents = false;
  isShowOnlyOwnEvents = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.lastSelectedEventType = this.selectedEventType;
    this.userService.getAllEvents().subscribe(events => {
      this.events = events;
      this.events.sort((a, b) => b.eventDate.localeCompare(a.eventDate));
      this.eventsToShow = events;
    });

    this.userService.getAllEventType().subscribe(eventTypes => {
      this.eventTypes = eventTypes;
    });
  }

  showEventsByType(): void {
    if (this.lastSelectedEventType === this.selectedEventType) {
      this.changeShowedEventsList();
      return;
    }

    if (this.selectedEventType === 'all') {
      this.userService.getAllEvents().subscribe(events => {
        this.events = events;
        this.changeShowedEventsList();
      });
    } else {
      this.userService.getEventsByType(this.selectedEventType).subscribe(events => {
        this.events = events;
        this.changeShowedEventsList();
      });
    }
    this.lastSelectedEventType = this.selectedEventType;
  }

  changeShowedEventsList(): void {
    this.eventsToShow = new Array();

    this.userService.getCurrentUser().subscribe(currentUser => {
      this.events.forEach(event => {
        this.userService.isUserParticipateInEvent(event.id, currentUser.email).subscribe(result => {
          if (this.isEventShowable(event, currentUser, result)) {
            this.eventsToShow.push(event);
          }
        });
      });
    });
  }

  isEventShowable(event: IEvent, currentUser: IUser, isParticipateResult: any): boolean {
    return (
      (!this.isShowOnlyOwnEvents || event.organizerEmail === currentUser.email) &&
      (!this.isShowOnlyPublicEvents || event.visibility === 'public') &&
      (!this.isShowOnlyEventsWhereParticipate || isParticipateResult['result'] === 'true')
    );
  }
}
