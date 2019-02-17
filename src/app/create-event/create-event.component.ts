import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {

  name: string;
  type: string;
  maxParticipants: number;
  estimatedCost: number;
  country: string;
  city: string;
  street: string;
  streetNumber: string;
  description: string;
  eventDate: string;
  visibilities = ['public', 'restricted', 'private'];
  visibility = this.visibilities[0];

  constructor(private userService: UserService) { }

  ngOnInit() { }

  createEvent(): void {
    if (this.visibility == 'visibility') {
      alert('Please select a visibility!');
      return;
    }

    this.userService.getCurrentUser().subscribe(user => {
      this.userService.createEvent(this.name, this.description, this.maxParticipants, this.visibility, this.estimatedCost, '2018-08-08', 2, this.type, user['email']).subscribe(respond => {
        alert('Event created!');
        this.resetInputFields();
      }, error => {
        console.log(error);
      });
    }, error => {
      console.log(error);
    });
  }

  resetInputFields(): void {
    this.name = '';
    this.type = '';
    this.maxParticipants = 0;
    this.estimatedCost = 0;
    this.country = '';
    this.city = '';
    this.street = '';
    this.streetNumber = '';
    this.description = '';
    this.eventDate = '';
  }
}
