import { Component, OnInit } from '@angular/core';
import { IEvent } from '../interface/IEvent';
import { EventService } from '../services/rest/event.service';
import { EventTypeService } from '../services/rest/event-type.service';
import { AddressService } from '../services/rest/address.service';
import { UserService } from '../services/rest/user.service';
import { IUser } from '../interface/IUser';
import { IAddress } from '../interface/IAddress';
import { Observable } from 'rxjs';

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
  eventNameToSearch = '';
  countryToSearch = '';
  cityToSearch = '';

  constructor(
    private eventService: EventService,
    private eventTypeService: EventTypeService,
    private addressService: AddressService,
    private userService: UserService
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

  searchEventsByType(): void {
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

  async changeShowedEventsList(): Promise<any> {
    this.eventsToShow = new Array();
    const userEmail = sessionStorage.getItem('userEmail');

    const eventsLength = this.events.length;
    return new Promise(resolve => {
      this.events.forEach((event, index) => {
        this.eventService.isUserParticipateInEvent(event.id, userEmail).subscribe(result => {
          if (this.isEventShowable(event, userEmail, result)) {
            this.eventsToShow.push(event);
          }
          if (index === eventsLength - 1) {
            this.eventsToShowLength = this.eventsToShow.length;
            resolve();
          }
        });
      });
    });
  }

  isEventShowable(event: IEvent, userEmail: string, isParticipateResult: any): boolean {
    return (
      (!this.isShowOnlyOwnEvents || event.organizerEmail === userEmail) &&
      (!this.isShowOnlyPublicEvents || event.visibility === 'public') &&
      (!this.isShowOnlyEventsWhereParticipate || isParticipateResult['result'] === 'true')
    );
  }

  showMoreEvents(): void {
    this.numberOfEventsToShow += this.showEventsStep;
    this.numberOfEventsToShow = Math.min(this.numberOfEventsToShow, this.events.length);
  }

  searchEventsByName(): void {
    this.numberOfEventsToShow = this.showEventsStep;
    this.eventService.getAllEvents().subscribe(events => {
      this.events = events.filter(event =>
        this.includesCaseInsensitive(event.name, this.eventNameToSearch)
      );
      this.changeShowedEventsList();
    });
  }

  includesCaseInsensitive(string: string, substring: string): boolean {
    return string.toLocaleLowerCase().includes(substring.toLocaleLowerCase());
  }

  searchEventsByAddress(): void {
    this.numberOfEventsToShow = this.showEventsStep;
    this.eventService.getAllEvents().subscribe(events => {
      this.userService.getCurrentUser().subscribe((user: IUser) => {
        this.addressService.getAddressById(user.addressId).subscribe((address: IAddress) => {
          this.events = events.filter((event: IEvent) =>
            this.includesCaseInsensitive(event.country, address.country)
          );
          this.changeShowedEventsList().then(() => {
            this.eventsToShow.sort((a, b) => this.sortEventsByDistanceThenDate(a, b, address));
          });
        });
      });
    });
  }

  sortEventsByDistanceThenDate(a, b, address: IAddress): number {
    const isAIncludes = this.includesCaseInsensitive(a.city, address.city);
    const isBIncludes = this.includesCaseInsensitive(b.city, address.city);

    if (isAIncludes === isBIncludes) {
      return b.eventDate.localeCompare(a.eventDate);
    }
    return isAIncludes ? -1 : 1;
  }
}
