import { Injectable } from '@angular/core';
import { BaseRestService } from './base-rest.service';
import { IEvent } from 'src/app/interface/IEvent';
import { HttpClient } from '@angular/common/http';
import { IUser } from 'src/app/interface/IUser';
import { IEventCreator } from 'src/app/interface/IEventCreator';
import { IInvitation } from 'src/app/interface/IInvitation';
import { INews } from 'src/app/interface/INews';

@Injectable({
  providedIn: 'root'
})
export class EventService extends BaseRestService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getEventById(id: number) {
    const url = 'events/' + id;
    return this.getMethod<IEvent>(url);
  }

  createEvent(event: IEventCreator) {
    const url = 'events/create';
    return this.postMethod(url, event);
  }

  getEventParticipants(eventId: number) {
    const url = 'events/' + eventId + '/users';
    return this.getMethod<Array<IUser>>(url);
  }

  getAllEvents() {
    const url = 'events/all';
    return this.getMethod<Array<IEvent>>(url);
  }

  isUserParticipateInEvent(eventId: number, userEmail: String) {
    const url = 'events/' + eventId + '/is-participate/' + userEmail;
    return this.getMethod(url);
  }

  addUserToEvent(eventId: number, userEmail: String) {
    const url = 'events/' + eventId + '/add-user/' + userEmail;
    return this.getMethod(url);
  }

  getEventsByType(type: string) {
    const url = 'events/type/' + type;
    return this.getMethod<Array<IEvent>>(url);
  }

  isEventHasMorePlace(eventId: number) {
    const url = 'events/' + eventId + '/has-more-place';
    return this.getMethod(url);
  }

  getInvitationRequestsForEvent(eventId: number) {
    const url = 'events/' + eventId + '/invitation-requests';
    return this.getMethod<Array<IInvitation>>(url);
  }

  getInvitationOffersForEvent(eventId: number) {
    const url = 'events/' + eventId + '/invitation-offers';
    return this.getMethod<Array<IInvitation>>(url);
  }

  updateEventInfo(eventId: number, event: IEventCreator) {
    const url = 'events/update-info/' + eventId;
    return this.putMethod(url, event);
  }

  getEventNews(eventId: number) {
    const url = 'events/' + eventId + '/news';
    return this.getMethod<Array<INews>>(url);
  }

  deleteEvent(eventId: number) {
    const url = 'events/delete/' + eventId;
    return this.deleteMethod(url);
  }
}
