import { Injectable } from '@angular/core';
import { BaseRestService } from './base-rest.service';
import { HttpClient } from '@angular/common/http';
import { IInvitation } from 'src/app/interface/IInvitation';

@Injectable({
  providedIn: 'root'
})
export class InvitationService extends BaseRestService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getInvitationsForUser(userEmail: String) {
    const url = 'invitations/users/' + userEmail;
    return this.getMethod(url);
  }

  answerToInvitation(invitationId: number, isAccepted: number) {
    const url = 'invitations/' + invitationId + '/answer/' + isAccepted;
    return this.getMethod(url);
  }

  getInvitationById(invitationId: string) {
    const url = 'invitations/' + invitationId;
    return this.getMethod<IInvitation>(url);
  }

  createInvitation(invitation: IInvitation) {
    const url = 'invitations/create';
    return this.postMethod(url, invitation);
  }

  isUserHasRequest(eventId: number, userEmail: string) {
    const url = 'invitations/is-invited/' + eventId + '/' + userEmail;
    return this.getMethod(url);
  }

  deleteInvitation(invitationId: number) {
    const url = 'invitations/' + invitationId + '/delete';
    return this.getMethod(url);
  }

  getNotSeenNotificationCount() {
    const url = 'invitations/not-seen';
    return this.getMethod(url);
  }

  updateAllInvitationToAlreadySeen() {
    const url = 'invitations/mark-all-as-seen';
    return this.putMethod(url, null);
  }
}
