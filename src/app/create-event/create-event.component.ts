import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { NgxSpinnerService } from 'ngx-spinner';
import { IEventCreator } from '../interface/IEventCreator';
import { IAddress } from '../interface/IAddress';
import { EventService } from '../services/rest/event.service';
import { TranslateService } from '@ngx-translate/core';

declare const $: any;

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements AfterViewInit {
  name: string;
  type: string;
  maxParticipants: any;
  country: string;
  city: string;
  street: string;
  streetNumber: string;
  description: string;
  eventDate: Date = new Date();
  visibilities = ['public', 'restricted', 'private'];
  visibility = this.visibilities[0];
  isCreateButtonClickable = true;
  private isPickerOpen = false;

  constructor(
    private spinner: NgxSpinnerService,
    private elementRef: ElementRef,
    private eventService: EventService,
    private translate: TranslateService
  ) {
    this.eventDate.setSeconds(0, 0);
  }

  createEvent(): void {
    if (!this.isAllInputValid()) {
      this.translate.get('popup.create_event.empty_field').subscribe(text => {
        alert(text);
      });
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
      eventDate: this.eventDate,
      eventType: this.type,
      address: address
    };

    this.eventService.createEvent(event).subscribe(
      () => {
        this.translate.get('popup.create_event.event_created').subscribe(text => {
          alert(text);
        });
        this.resetInputFields();
        this.isCreateButtonClickable = true;
        this.spinner.hide();
      },
      () => {
        this.translate.get('popup.create_event.creation_failed').subscribe(text => {
          alert(text);
        });
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
      this.isValidInteger(this.maxParticipants)
    );
  }

  isNonEmptyString(text: string): boolean {
    return !isNullOrUndefined(text) && text !== '';
  }

  isValidInteger(num: any): boolean {
    return this.isNonEmptyString(num) && Number.isInteger(+num);
  }

  resetInputFields(): void {
    this.name = '';
    this.type = '';
    this.maxParticipants = null;
    this.country = '';
    this.city = '';
    this.street = '';
    this.streetNumber = '';
    this.description = '';
  }

  ngAfterViewInit(): void {
    const dropdownToggle = $('[data-toggle="dropdown"]', this.elementRef.nativeElement);
    dropdownToggle.parent().on('show.bs.dropdown', () => {
      this.isPickerOpen = true;
    });
    dropdownToggle.parent().on('hide.bs.dropdown', () => {
      this.isPickerOpen = false;
    });
  }

  keepDropDownOpen(event: Event) {
    event.stopPropagation();
  }

  dateSelected(event) {
    if (this.isPickerOpen && event.value) {
      $('.date-dropdown').dropdown('toggle');
    }
  }
}
