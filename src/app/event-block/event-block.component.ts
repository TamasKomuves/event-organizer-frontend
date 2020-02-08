import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/rest/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { IInvitation } from '../interface/IInvitation';
import { AddressService } from '../services/rest/address.service';
import { EventService } from '../services/rest/event.service';
import { InvitationService } from '../services/rest/invitation.service';

@Component({
  selector: 'app-event-block',
  templateUrl: './event-block.component.html',
  styleUrls: ['./event-block.component.css']
})
export class EventBlockComponent implements OnInit {
  @Input() eventId: number;

  name: string;
  date: Date;
  organizerName: string;
  numberOfParticipants: any;
  type: string;
  visibility: string;
  location: string;
  isPublic: boolean;
  spinnerName: string;
  isParticipate = false;
  hasMorePlace = false;
  hasRequest = true;
  isParticipateLoaded = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private addressService: AddressService,
    private eventService: EventService,
    private invitationService: InvitationService
  ) {}

  ngOnInit() {
    this.spinnerName = 'mySpinner' + this.eventId;
    this.spinner.show(this.spinnerName);
    this.eventService.getEventById(this.eventId).subscribe(event => {
      this.name = event.name;
      this.date = event.eventDate;
      this.type = event.eventType;
      this.visibility = event.visibility;

      this.addressService.getAddressById(event.addressId).subscribe(address => {
        this.location =
          address.street +
          ' ' +
          address.streetNumber +
          ', ' +
          address.city +
          ', ' +
          address.country;
      });

      if (event.organizerEmail === null) {
        this.organizerName = 'deleted profile';
      } else {
        this.userService.getUserByEmail(event.organizerEmail).subscribe(user => {
          this.organizerName = user.firstName + ' ' + user.lastName;
        });
      }

      this.userService.getCurrentUser().subscribe(currentUser => {
        this.invitationService
          .isUserHasRequest(this.eventId, currentUser.email)
          .subscribe(result => {
            this.hasRequest = result['result'] === 'true';
          });

        this.eventService
          .isUserParticipateInEvent(this.eventId, currentUser.email)
          .subscribe(result => {
            this.isParticipate = result['result'] === 'true';
            this.isParticipateLoaded = true;
            this.spinner.hide(this.spinnerName);
          });
      });

      this.isPublic = this.visibility === 'public';
    });

    this.eventService.isEventHasMorePlace(this.eventId).subscribe(result => {
      this.hasMorePlace = result['result'] === 'true';
    });

    this.eventService.getEventParticipants(this.eventId).subscribe(participants => {
      this.numberOfParticipants = participants.length;
    });
  }

  joinEvent(): void {
    this.isParticipate = true;
    this.userService.getCurrentUser().subscribe(currentUser => {
      this.eventService.addUserToEvent(this.eventId, currentUser.email).subscribe(
        data2 => {
          if (data2['result'] === 'success') {
            this.router.navigate(['/event'], { queryParams: { eventId: this.eventId } });
          } else if (data2['result'] === 'no more place') {
            alert('The event is full!');
          } else if (data2['result'] === 'already added') {
            alert('Already participate!');
          }
        },
        error => {
          console.log(error);
        }
      );
    });
  }

  requestInvitation(): void {
    this.hasRequest = true;
    this.userService.getCurrentUser().subscribe(user => {
      const invitation: IInvitation = {
        eventId: this.eventId,
        userEmail: user.email,
        isUserRequested: 1
      };
      this.invitationService.createInvitation(invitation).subscribe(
        result => {
          alert('Request sent');
        },
        error => {
          alert('Request sending failed');
        }
      );
    });
  }

  showEventDetails(): void {
    this.router.navigate(['/event'], { queryParams: { eventId: this.eventId } });
  }
}
