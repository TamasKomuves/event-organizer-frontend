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
  numberOfParticipants: number;
  type: string;
  visibility: string;
  location: string;
  isPublic: boolean;
  isShowable: boolean;
  isParticipate: boolean;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {

    this.userService.getEventById(this.eventId).subscribe(data => {
      this.name = data['name'];
      this.date = data['eventDate'];
      this.type = data['eventType'];
      this.visibility = data['visibility'];

      this.userService.getUserByEmail(data['organizerEmail']).subscribe(data2 => {
        this.organizerName = data2['firstName'] + ' ' + data2['lastName'];
      });

      this.isPublic = this.visibility === 'public';
      this.isShowable = this.visibility != 'private';
    });

    this.userService.getCurrentUser().subscribe(data2 => {
      this.userService.isUserParticipateInEvent(this.eventId, data2['email']).subscribe(data3 => {
        this.isParticipate = data3['result'] === 'true';
      });
    });
  }

  joinEvent(): void {
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

  showEventDetails(): void {
    this.router.navigate(['/event'], { queryParams: { eventId: this.eventId } });
  }
}
