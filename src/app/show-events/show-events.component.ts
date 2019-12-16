import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/rest/user.service';
import { IEvent } from '../interface/IEvent';
import { IUser } from '../interface/IUser';
import { EventService } from '../services/rest/event.service';
import { EventTypeService } from '../services/rest/event-type.service';

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
  showEventsStep = 5;
  numberOfEventsToShow = this.showEventsStep;
  eventsToShowLength = 0;

  constructor(
    private userService: UserService,
    private eventService: EventService,
    private eventTypeService: EventTypeService
  ) {}

  ngOnInit() {
    this.lastSelectedEventType = this.selectedEventType;
    this.eventService.getAllEvents().subscribe(events => {
      this.events = events;
      this.events.sort((a, b) => b.eventDate.toString().localeCompare(a.eventDate.toString()));
      this.eventsToShow = events;
      this.eventsToShowLength = this.eventsToShow.length;
    });

    this.eventTypeService.getAllEventType().subscribe(eventTypes => {
      this.eventTypes = eventTypes;
    });
  }

  searchEvents(): void {
    if (this.lastSelectedEventType === this.selectedEventType) {
      this.changeShowedEventsList();
      return;
    }

    this.numberOfEventsToShow = this.showEventsStep;
    if (this.selectedEventType === 'all') {
      this.eventService.getAllEvents().subscribe(events => {
        this.events = events;
        this.changeShowedEventsList();
      });
    } else {
      this.eventService.getEventsByType(this.selectedEventType).subscribe(events => {
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
        this.eventService
          .isUserParticipateInEvent(event.id, currentUser.email)
          .subscribe(result => {
            if (this.isEventShowable(event, currentUser, result)) {
              this.eventsToShow.push(event);
            }
          });
      });
      this.eventsToShowLength = this.eventsToShow.length;
    });
  }

  isEventShowable(event: IEvent, currentUser: IUser, isParticipateResult: any): boolean {
    return (
      (!this.isShowOnlyOwnEvents || event.organizerEmail === currentUser.email) &&
      (!this.isShowOnlyPublicEvents || event.visibility === 'public') &&
      (!this.isShowOnlyEventsWhereParticipate || isParticipateResult['result'] === 'true')
    );
  }

  showMoreEvents(): void {
    this.numberOfEventsToShow += this.showEventsStep;
    this.numberOfEventsToShow = Math.min(this.numberOfEventsToShow, this.events.length);
  }
}
