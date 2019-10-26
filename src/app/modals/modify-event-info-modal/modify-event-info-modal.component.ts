import { Component, Input, AfterViewInit } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { UserService } from '../../services/user.service';
import { formatDate } from '@angular/common';
import { NgxSmartModalComponent, NgxSmartModalService } from 'ngx-smart-modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { IAddress } from 'src/app/interface/IAddress';
import { IEventCreator } from 'src/app/interface/IEventCreator';
import { IEvent } from 'src/app/interface/IEvent';

@Component({
  selector: 'app-modify-event-info-modal',
  templateUrl: './modify-event-info-modal.component.html',
  styleUrls: ['./modify-event-info-modal.component.css']
})
export class ModifyEventInfoModalComponent implements AfterViewInit {
  @Input() eventId;

  event: IEvent;
  address: IAddress;
  visibilities = ['public', 'restricted', 'private'];
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
      this.userService.getEventById(this.eventId).subscribe(event => {
        this.event = event;
        this.event.eventDate = formatDate(event.eventDate, 'yyyy-MM-dd HH:mm', 'en');
        this.userService.getAddressById(event.addressId).subscribe(address => {
          this.address = address;
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

    const event: IEventCreator = {
      name: this.event.name, description: this.event.description, maxParticipant: this.event.maxParticipant, totalCost: this.event.totalCost,
      eventDate: new Date(this.event.eventDate + ':00'), visibility: this.event.visibility, eventType: this.event.eventType, address: this.address
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
      this.isNonEmptyString(this.event.name) &&
      this.isNonEmptyString(this.event.eventType) &&
      this.isNonEmptyString(this.address.country) &&
      this.isNonEmptyString(this.address.city) &&
      this.isNonEmptyString(this.address.street) &&
      this.isNonEmptyString(this.address.streetNumber) &&
      this.isNonEmptyString(this.event.description) &&
      this.isValidInteger(this.event.maxParticipant) &&
      this.isValidInteger(this.event.totalCost) &&
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

    return this.isNonEmptyString(this.event.eventDate) && regexp.test(this.event.eventDate);
  }

  resetInputFields(): void {
    this.event.name = '';
    this.event.eventType = '';
    this.event.maxParticipant = null;
    this.event.totalCost = null;
    this.address.country = '';
    this.address.city = '';
    this.address.street = '';
    this.address.streetNumber = '';
    this.event.description = '';
    this.event.eventDate = '';
  }
}
