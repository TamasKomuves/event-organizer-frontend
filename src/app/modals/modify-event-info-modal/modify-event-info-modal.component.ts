import { Component, Input, AfterViewInit, ElementRef } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { UserService } from '../../services/rest/user.service';
import { NgxSmartModalComponent, NgxSmartModalService } from 'ngx-smart-modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { IAddress } from 'src/app/interface/IAddress';
import { IEventCreator } from 'src/app/interface/IEventCreator';
import { IEvent } from 'src/app/interface/IEvent';
import { AddressService } from 'src/app/services/rest/address.service';
import { EventService } from 'src/app/services/rest/event.service';
import { TranslateService } from '@ngx-translate/core';

declare const $: any;

@Component({
  selector: 'app-modify-event-info-modal',
  templateUrl: './modify-event-info-modal.component.html',
  styleUrls: ['./modify-event-info-modal.component.css']
})
export class ModifyEventInfoModalComponent implements AfterViewInit {
  @Input() eventId;

  MAX_PARTICIPANT_ERROR_MESSAGE = 'The new max participant is not high enough!';

  event: IEvent;
  address: IAddress;
  visibilities = ['public', 'restricted', 'private'];
  isLoaded = false;
  private isPickerOpen = false;

  constructor(
    private userService: UserService,
    private ngxSmartModalService: NgxSmartModalService,
    private spinner: NgxSpinnerService,
    private elementRef: ElementRef,
    private addressService: AddressService,
    private eventService: EventService,
    private translate: TranslateService
  ) {}

  ngAfterViewInit() {
    const modifyEventInfoModal = this.ngxSmartModalService.getModal('modifyEventInfoModal');
    modifyEventInfoModal.dismissable = false;

    modifyEventInfoModal.onOpen.subscribe((modal: NgxSmartModalComponent) => {
      this.isLoaded = false;
      this.eventService.getEventById(this.eventId).subscribe(event => {
        this.event = event;
        this.event.eventDate = new Date(event.eventDate);
        this.addressService.getAddressById(event.addressId).subscribe(address => {
          this.address = address;
          this.isLoaded = true;
        });
      });
    });

    const dropdownToggle = $('[data-toggle="dropdown"]', this.elementRef.nativeElement);
    dropdownToggle.parent().on('show.bs.dropdown', () => {
      this.isPickerOpen = true;
    });
    dropdownToggle.parent().on('hide.bs.dropdown', () => {
      this.isPickerOpen = false;
    });
  }

  modifyEventInfo(): void {
    this.isLoaded = false;
    this.spinner.show();
    if (!this.isAllInputValid()) {
      this.translate.get('popup.modify_event.fill_in_all_fields').subscribe(text => {
        alert(text);
      });
      this.isLoaded = true;
      this.spinner.hide();
      return;
    }

    const event: IEventCreator = {
      name: this.event.name,
      description: this.event.description,
      maxParticipant: this.event.maxParticipant,
      eventDate: this.event.eventDate,
      visibility: this.event.visibility,
      eventType: this.event.eventType,
      address: this.address
    };

    this.eventService.updateEventInfo(this.eventId, event).subscribe(
      result => {
        this.resetInputFields();
        const modifyEventInfoModal = this.ngxSmartModalService.getModal('modifyEventInfoModal');
        modifyEventInfoModal.close();
        this.translate.get('popup.modify_event.updated').subscribe(text => {
          alert(text);
        });
        this.spinner.hide();
        this.isLoaded = true;
      },
      error => {
        console.log(error);
        if (error.error.message === this.MAX_PARTICIPANT_ERROR_MESSAGE) {
          this.translate.get('popup.modify_event.too_low_max_participants').subscribe(text => {
            alert(text);
          });
        } else {
          this.translate.get('popup.modify_event.modification_failed').subscribe(text => {
            alert(text);
          });
        }
        this.spinner.hide();
        this.isLoaded = true;
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
      this.isValidInteger(this.event.maxParticipant)
    );
  }

  isNonEmptyString(text: string): boolean {
    return !isNullOrUndefined(text) && text !== '';
  }

  isValidInteger(num: any): boolean {
    return this.isNonEmptyString(num) && Number.isInteger(+num);
  }

  resetInputFields(): void {
    this.event.name = '';
    this.event.eventType = '';
    this.event.maxParticipant = null;
    this.address.country = '';
    this.address.city = '';
    this.address.street = '';
    this.address.streetNumber = '';
    this.event.description = '';
    this.event.eventDate = null;
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
