import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // SERVER_LINK = 'https://powerful-shelf-66888.herokuapp.com/';
  SERVER_LINK = 'http://localhost:8080/';

  constructor(private httpClient: HttpClient) {}

  getOptionsWithHeaders() {
    return { headers: new HttpHeaders().set('authorization', 'Bearer ' + sessionStorage.getItem('token')) };
  }

  getMethod(url: string) {
    return this.httpClient.get(this.SERVER_LINK + url, this.getOptionsWithHeaders());
  }

  postMethod(url: string, params: HttpParams) {
    return this.httpClient.post(this.SERVER_LINK + url, null, {
      headers: new HttpHeaders().set('content-type', 'application/json'),
      params: params
    });
  }

  login(email: string, password: string) {
    return this.httpClient.get(this.SERVER_LINK + 'public/users/login/' + email + '/' + password);
  }

  logout() {
    const url = 'users/logout';
    return this.getMethod(url);
  }

  getCurrentUser() {
    const url = 'users/current';
    return this.getMethod(url);
  }

  getUserByEmail(email: string) {
    const url = 'users/' + email;
    return this.getMethod(url);
  }

  getEventById(id: number) {
    const url = 'events/' + id;
    return this.getMethod(url);
  }

  getEventPosts(eventId: number) {
    const url = 'events/' + eventId + '/posts';
    return this.getMethod(url);
  }

  getPostComments(postId: number) {
    const url = 'posts/' + postId + '/comments';
    return this.getMethod(url);
  }

  getPostById(postId: number) {
    const url = 'posts/' + postId;
    return this.getMethod(url);
  }

  getPostLikers(postId: number) {
    const url = 'posts/' + postId + '/likers';
    return this.getMethod(url);
  }

  getCommentById(commentId: number) {
    const url = 'comments/' + commentId;
    return this.getMethod(url);
  }

  getCommentLikes(commentId: number) {
    const url = 'comments/' + commentId + '/likers';
    return this.getMethod(url);
  }

  getEventParticipants(eventId: number) {
    const url = 'events/' + eventId + '/users';
    return this.getMethod(url);
  }

  createPost(eventId: number, userEmail: string, text: string) {
    const url = 'posts/create/' + eventId + '/' + userEmail + '/' + text;
    return this.getMethod(url);
  }

  createComment(postId: number, commenter_email: string, text: string) {
    const url = 'comments/create/' + postId + '/' + commenter_email + '/' + text;
    return this.getMethod(url);
  }

  createEvent(
    name: string,
    description: string,
    max_participant: number,
    visibility: string,
    total_cost: number,
    event_date: string,
    address_id: number,
    event_type_type: String,
    organizer_email: string
  ) {
    const url =
      'events/create/' +
      name +
      '/' +
      description +
      '/' +
      max_participant +
      '/' +
      visibility +
      '/' +
      total_cost +
      '/' +
      event_date +
      '/' +
      address_id +
      '/' +
      event_type_type +
      '/' +
      organizer_email;
    return this.getMethod(url);
  }

  createAddress(country: string, city: string, street: string, streetNumber: string) {
    const url = 'addresses/create/' + country + '/' + city + '/' + street + '/' + streetNumber;
    return this.getMethod(url);
  }

  createLikesComment(userEmail: string, commentId: number) {
    const url = 'likes-comments/create/' + userEmail + '/' + commentId;
    return this.getMethod(url);
  }

  createLikesPost(userEmail: string, postId: number) {
    const url = 'likes-posts/create/' + userEmail + '/' + postId;
    return this.getMethod(url);
  }

  isLikedComment(commentId: number, email: string) {
    const url = 'comments/' + commentId + '/likers/' + email;
    return this.getMethod(url);
  }

  isLikedPost(postId: number, email: string) {
    const url = 'posts/' + postId + '/likers/' + email;
    return this.getMethod(url);
  }

  register(
    email: string,
    password: string,
    firstname: string,
    lastname: string,
    country: string,
    city: string,
    street: string,
    streetNumber: string
  ) {
    const url = 'public/users/registration';

    const httpParams = new HttpParams()
      .append('email', email)
      .append('password', password)
      .append('firstname', firstname)
      .append('lastname', lastname)
      .append('country', country)
      .append('city', city)
      .append('street', street)
      .append('streetNumber', streetNumber);

    return this.postMethod(url, httpParams);
  }

  getAllEvents() {
    const url = 'events';
    return this.getMethod(url);
  }

  isUserParticipateInEvent(eventId: number, userEmail: String) {
    const url = 'events/' + eventId + '/is-participate/' + userEmail;
    return this.getMethod(url);
  }

  addUserToEvent(eventId: number, userEmail: String) {
    const url = 'events/' + eventId + '/add-user/' + userEmail;
    return this.getMethod(url);
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
    return this.getMethod(url);
  }

  createInvitation(eventId: number, userEmail: string, isUserRequested: number) {
    const url = 'invitations/create/' + eventId + '/' + userEmail + '/' + isUserRequested;
    return this.getMethod(url);
  }

  getAddressById(addressId: number) {
    const url = 'addresses/' + addressId;
    return this.getMethod(url);
  }

  getAllEventType() {
    const url = 'event-types/all';
    return this.getMethod(url);
  }

  getEventsByType(type: string) {
    const url = 'events/type/' + type;
    return this.getMethod(url);
  }

  isEventHasMorePlace(eventId: number) {
    const url = 'events/' + eventId + '/has-more-place';
    return this.getMethod(url);
  }

  isUserHasRequest(eventId: number, userEmail: string) {
    const url = 'invitations/is-invited/' + eventId + '/' + userEmail;
    return this.getMethod(url);
  }

  updateAddress(addressId: number, country: string, city: string, street: string, streetNumber: string) {
    const url =
      'addresses/update/' + addressId + '/' + country + '/' + city + '/' + street + '/' + streetNumber;
    return this.getMethod(url);
  }

  updateUserName(email: string, firstname: string, lastname: string) {
    const url = 'users/update/' + email + '/' + firstname + '/' + lastname;
    return this.getMethod(url);
  }

  deleteUser(email: string) {
    const url = 'users/delete/' + email;
    return this.getMethod(url);
  }

  getInvitationRequestsForEvent(eventId: number) {
    const url = 'events/' + eventId + '/invitation-requests';
    return this.getMethod(url);
  }

  getInvitationOffersForEvent(eventId: number) {
    const url = 'events/' + eventId + '/invitation-offers';
    return this.getMethod(url);
  }

  deleteInvitation(invitationId: number) {
    const url = 'invitations/' + invitationId + '/delete';
    return this.getMethod(url);
  }

  updateEventInfo(
    eventId: number,
    name: string,
    description: string,
    max_participant: number,
    total_cost: number,
    event_date: string,
    visibility: string,
    address_id: number,
    event_type_type: string
  ) {
    const url =
      'events/' +
      eventId +
      '/update-info/' +
      name +
      '/' +
      description +
      '/' +
      max_participant +
      '/' +
      total_cost +
      '/' +
      event_date +
      '/' +
      visibility +
      '/' +
      address_id +
      '/' +
      event_type_type;
    return this.getMethod(url);
  }
}
