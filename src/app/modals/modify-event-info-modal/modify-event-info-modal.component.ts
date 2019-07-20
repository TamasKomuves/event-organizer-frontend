import { Component, Input, AfterViewInit } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { UserService } from 'src/app/services/user.service';
import { formatDate } from '@angular/common';
import { NgxSmartModalComponent, NgxSmartModalService } from 'ngx-smart-modal';

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

  constructor(private userService: UserService, private ngxSmartModalService: NgxSmartModalService) {}

  ngAfterViewInit() {
    const modifyEventInfoModal = this.ngxSmartModalService.getModal('modifyEventInfoModal');

    modifyEventInfoModal.onOpen.subscribe((modal: NgxSmartModalComponent) => {
      this.isLoaded = false;
      this.resetInputFields();
      this.userService.getEventById(this.eventId).subscribe(event => {
        this.name = event['name'];
        this.type = event['eventType'];
        this.maxParticipants = event['maxParticipant'];
        this.estimatedCost = event['totalCost'];
        this.description = event['description'];
        this.eventDate = formatDate(event['eventDate'], 'yyyy-MM-dd HH:mm', 'en');
        this.visibility = event['visibility'];
        this.userService.getAddressById(event['addressId']).subscribe(address => {
          this.country = address['country'];
          this.city = address['city'];
          this.street = address['street'];
          this.streetNumber = address['streetNumber'];
          this.isLoaded = true;
        });
      });
    });
  }

  modifyEventInfo(): void {
    this.isLoaded = false;
    if (!this.isAllInputValid()) {
      alert('Please fill in all fields!');
      this.isLoaded = true;
      return;
    }

    this.userService.getEventById(this.eventId).subscribe(event => {
      this.userService
        .updateEventInfo(
          this.eventId,
          this.name,
          this.description,
          this.maxParticipants,
          this.estimatedCost,
          this.eventDate + ':00',
          this.visibility,
          event['addressId'],
          this.type
        )
        .subscribe(result => {
          this.userService
            .updateAddress(event['addressId'], this.country, this.city, this.street, this.streetNumber)
            .subscribe(result2 => {
              this.resetInputFields();
              const modifyEventInfoModal = this.ngxSmartModalService.getModal('modifyEventInfoModal');
              modifyEventInfoModal.close();
              alert('Event info updated');
            });
        });
    });
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
