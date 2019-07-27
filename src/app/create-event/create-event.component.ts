import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { isNullOrUndefined } from 'util';
import { NgxSpinnerService } from 'ngx-spinner';

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
    this.userService.getCurrentUser().subscribe(
      user => {
        this.userService
          .createAddress(this.country, this.city, this.street, this.streetNumber)
          .subscribe(result => {
            this.userService
              .createEvent(
                this.name,
                this.description,
                this.maxParticipants,
                this.visibility,
                this.estimatedCost,
                new Date(this.eventDate),
                result['addressId'],
                this.type,
                user['email']
              )
              .subscribe(
                respond => {
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
          });
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
