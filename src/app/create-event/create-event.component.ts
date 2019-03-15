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
  isCreateButtonClickable = true;

  constructor(private userService: UserService) { }

  ngOnInit() { }

  createEvent(): void {
    this.isCreateButtonClickable = false;
    this.userService.getCurrentUser().subscribe(user => {
      this.userService.createAddress(this.country, this.city, this.street, this.streetNumber).subscribe(result => {
        this.userService.createEvent(this.name, this.description, this.maxParticipants, this.visibility, this.estimatedCost, '2018-08-08', 2, this.type, user['email']).subscribe(respond => {
          alert('Event created!');
          this.resetInputFields();
          this.isCreateButtonClickable = true;
        }, error => {
          console.log(error);
          alert('Event creation failed!');
          this.isCreateButtonClickable = true;
        });
      });
    }, error => {
      console.log(error);
      alert('Event creation failed!');
      this.isCreateButtonClickable = true;
    });
  }

  resetInputFields(): void {
    this.name = '';
    this.type = '';
    this.maxParticipants = null;
    this.estimatedCost = null;
    this.country = '';
    this.city = '';
    this.street = '';
    this.streetNumber = '';
    this.description = '';
    this.eventDate = '';
  }
}
