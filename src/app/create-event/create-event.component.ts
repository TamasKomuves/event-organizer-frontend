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
  visibility: string;
  eventDate: string;

  constructor(private userService: UserService) { this.visibility = 'visibility'; }

  ngOnInit() {
    this.visibility = 'visibility';
  }

  createEvent(): void {
  	if (this.visibility == 'visibility') {
  		alert('Please select a visibility!');
  		return;
  	}
  
    this.userService.getCurrentUser().subscribe(data => {
      this.userService.createEvent(this.name, this.description, this.maxParticipants, this.visibility
        , this.estimatedCost, '2018-08-08', 2, this.type, data['email']).subscribe(data2 => {
          alert('Event created!');
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
        }, error => {
        	console.log(error);
        });
    }, error => {
    	console.log(error);
    });

  }
}
