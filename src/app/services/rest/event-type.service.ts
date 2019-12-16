import { Injectable } from '@angular/core';
import { BaseRestService } from './base-rest.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EventTypeService extends BaseRestService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getAllEventType() {
    const url = 'event-types/all';
    return this.getMethod(url);
  }
}
