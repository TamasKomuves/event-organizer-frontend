import { Injectable } from '@angular/core';
import { BaseRestService } from './base-rest.service';
import { HttpClient } from '@angular/common/http';
import { IAddress } from '../../interface/IAddress';

@Injectable({
  providedIn: 'root'
})
export class AddressService extends BaseRestService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getAddressById(addressId: number) {
    const url = 'addresses/' + addressId;
    return this.getMethod<IAddress>(url);
  }

  updateAddress(
    addressId: number,
    country: string,
    city: string,
    street: string,
    streetNumber: string
  ) {
    const url =
      'addresses/update/' +
      addressId +
      '/' +
      country +
      '/' +
      city +
      '/' +
      street +
      '/' +
      streetNumber;
    return this.getMethod(url);
  }
}
