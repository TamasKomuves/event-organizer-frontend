import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-event-block',
  templateUrl: './event-block.component.html',
  styleUrls: ['./event-block.component.css']
})
export class EventBlockComponent implements OnInit {

  @Input() eventId: number;

  name: string;
  date: string;
  organizerName: string;
  numberOfParticipants: any;
  type: string;
  visibility: string;
  location: string;
  isPublic: boolean;
  isParticipate = false;
  isHasMorePlace = false;
  isHasRequest = true;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {

    this.userService.getEventById(this.eventId).subscribe(event => {
      this.name = event['name'];
      this.date = event['eventDate'];
      this.type = event['eventType'];
      this.visibility = event['visibility'];

      this.userService.getAddressById(event['addressId']).subscribe(address => {
        this.location = address['street'] + ' ' + address['streetNumber'] + ', ' + address['city'] + ', ' + address['country'];
      });

      this.userService.getUserByEmail(event['organizerEmail']).subscribe(user => {
        this.organizerName = user['firstName'] + ' ' + user['lastName'];
      });

      this.userService.getCurrentUser().subscribe(currentUser => {
        this.userService.isUserHasRequest(this.eventId, currentUser['email']).subscribe(result => {
          this.isHasRequest = result['result'] === 'true';
        });
      })

      this.isPublic = this.visibility === 'public';
    });

    this.userService.isEventHasMorePlace(this.eventId).subscribe(result => {
      this.isHasMorePlace = result['result'] === 'true';
    });

    this.userService.getEventParticipants(this.eventId).subscribe(participants => {
      this.numberOfParticipants = Object.keys(participants).length;
    });

    this.userService.getCurrentUser().subscribe(data2 => {
      this.userService.isUserParticipateInEvent(this.eventId, data2['email']).subscribe(data3 => {
        this.isParticipate = data3['result'] === 'true';
      });
    });
  }

  joinEvent(): void {
    this.isParticipate = true;
    this.userService.getCurrentUser().subscribe(data => {
      this.userService.addUserToEvent(this.eventId, data['email']).subscribe(data2 => {
        if (data2['result'] === 'success') {
          this.router.navigate(['/event'], { queryParams: { eventId: this.eventId } });
        } else if (data2['result'] === 'no more place') {
          alert('The event is full!');
        } else if (data2['result'] === 'already added') {
          alert('Already participate!');
        }
      }, error => {
        console.log(error);
      });
    });
  }

  requestInvitation(): void {
    this.isHasRequest = true;
    this.userService.getCurrentUser().subscribe(user => {
      this.userService.createInvitation(this.eventId, user['email'], 1).subscribe(result => {
        alert('Request sent');
      }, error => {
        alert('Request sending failed');
      });
    });
  }

  showEventDetails(): void {
    this.router.navigate(['/event'], { queryParams: { eventId: this.eventId } });
  }
}
