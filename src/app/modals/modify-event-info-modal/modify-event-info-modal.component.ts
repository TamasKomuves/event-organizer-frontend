import { Component, Input, AfterViewInit } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { UserService } from '../../services/user.service';
import { formatDate } from '@angular/common';
import { NgxSmartModalComponent, NgxSmartModalService } from 'ngx-smart-modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { IAddress } from 'src/app/interface/IAddress';
import { IEventCreator } from 'src/app/interface/IEventCreator';

@Component({
  selector: 'app-modify-event-info-modal',
  templateUrl: './modify-event-info-modal.component.html',
  styleUrls: ['./modify-event-info-modal.component.css']
})
export class ModifyEventInfoModalComponent implements AfterViewInit {
  @Input() eventId;

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
  isLoaded = false;

  constructor(
    private userService: UserService,
    private ngxSmartModalService: NgxSmartModalService,
    private spinner: NgxSpinnerService
  ) { }

  ngAfterViewInit() {
    const modifyEventInfoModal = this.ngxSmartModalService.getModal('modifyEventInfoModal');

    modifyEventInfoModal.onOpen.subscribe((modal: NgxSmartModalComponent) => {
      this.isLoaded = false;
      this.resetInputFields();
      this.userService.getEventById(this.eventId).subscribe(event => {
        this.name = event.name;
        this.type = event.eventType;
        this.maxParticipants = event.maxParticipant;
        this.estimatedCost = event.totalCost;
        this.description = event.description;
        this.eventDate = formatDate(event.eventDate, 'yyyy-MM-dd HH:mm', 'en');
        this.visibility = event.visibility;
        this.userService.getAddressById(event.addressId).subscribe(address => {
          this.country = address.country;
          this.city = address.city;
          this.street = address.street;
          this.streetNumber = address.streetNumber;
          this.isLoaded = true;
        });
      });
    });
  }

  modifyEventInfo(): void {
    this.isLoaded = false;
    this.spinner.show();
    if (!this.isAllInputValid()) {
      alert('Please fill in all fields!');
      this.isLoaded = true;
      this.spinner.hide();
      return;
    }

    const address: IAddress = {
      city: this.city, country: this.country, street: this.street, streetNumber: this.streetNumber
    };

    const event: IEventCreator = {
      name: this.name, description: this.description, maxParticipant: this.maxParticipants, totalCost: this.estimatedCost,
      eventDate: new Date(this.eventDate + ':00'), visibility: this.visibility, eventType: this.type, address: address
    };

    this.userService.updateEventInfo(this.eventId, event).subscribe(result => {
      this.resetInputFields();
      const modifyEventInfoModal = this.ngxSmartModalService.getModal('modifyEventInfoModal');
      modifyEventInfoModal.close();
      alert('Event info updated');
      this.spinner.hide();
    },
      error => {
        console.log(error);
        alert('Modification failed!');
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
