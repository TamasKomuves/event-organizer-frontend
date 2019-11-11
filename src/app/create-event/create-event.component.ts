import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { isNullOrUndefined } from 'util';
import { NgxSpinnerService } from 'ngx-spinner';
import { IEventCreator } from '../interface/IEventCreator';
import { IAddress } from '../interface/IAddress';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {
  name: string;
  type: string;
  maxParticipants: any;
  estimatedCost: any;
  country: string;
  city: string;
  street: string;
  streetNumber: string;
  description: string;
  eventDate: string;
  visibilities = ['public', 'restricted', 'private'];
  visibility = this.visibilities[0];
  isCreateButtonClickable = true;

  constructor(private userService: UserService, private spinner: NgxSpinnerService) {}

  ngOnInit() {}

  createEvent(): void {
    if (!this.isAllInputValid()) {
      alert('Please fill in all fields!');
      return;
    }

    this.isCreateButtonClickable = false;
    this.spinner.show();

    const address: IAddress = {
      country: this.country,
      city: this.city,
      street: this.street,
      streetNumber: this.streetNumber
    };

    const event: IEventCreator = {
      name: this.name,
      description: this.description,
      maxParticipant: this.maxParticipants,
      visibility: this.visibility,
      totalCost: this.estimatedCost,
      eventDate: new Date(this.eventDate),
      eventType: this.type,
      address: address
    };

    this.userService.createEvent(event).subscribe(
      result => {
        alert('Event created!');
        this.resetInputFields();
        this.isCreateButtonClickable = true;
        this.spinner.hide();
      },
      error => {
        console.log(error);
        alert('Event creation failed!');
        this.isCreateButtonClickable = true;
        this.spinner.hide();
      }
    );
  }

  isAllInputValid(): boolean {
    return (
      this.isNonEmptyString(this.name) &&
      this.isNonEmptyString(this.type) &&
      this.isNonEmptyString(this.country) &&
      this.isNonEmptyString(this.city) &&
      this.isNonEmptyString(this.street) &&
      this.isNonEmptyString(this.streetNumber) &&
      this.isNonEmptyString(this.description) &&
      this.isValidInteger(this.maxParticipants) &&
      this.isValidInteger(this.estimatedCost) &&
      this.isDateValid()
    );
  }

  isNonEmptyString(text: string): boolean {
    return !isNullOrUndefined(text) && text !== '';
  }

  isValidInteger(num: any): boolean {
    return this.isNonEmptyString(num) && Number.isInteger(+num);
  }

  // TODO full date validation
  isDateValid(): boolean {
    const regexp: RegExp = /^(\d{4}-[01]\d-[0-3]\d [0-2]\d:[0-5]\d)$/;

    return this.isNonEmptyString(this.eventDate) && regexp.test(this.eventDate);
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
