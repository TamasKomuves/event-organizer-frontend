import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // SERVER_LINK = 'https://powerful-shelf-66888.herokuapp.com/';
  SERVER_LINK = 'http://localhost:8080/';

  constructor(private httpClient: HttpClient) {}

  getMethod(url: string) {
    return this.httpClient.get(this.SERVER_LINK + url, {
      headers: new HttpHeaders().set('authorization', 'Bearer ' + sessionStorage.getItem('token'))
    });
  }

  postMethod(url: string, body: any) {
    return this.httpClient.post(this.SERVER_LINK + url, body, {
      headers: new HttpHeaders()
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + sessionStorage.getItem('token'))
    });
  }

  postMethodWithoutAuth(url: string, body: any) {
    return this.httpClient.post(this.SERVER_LINK + url, body, {
      headers: new HttpHeaders().set('content-type', 'application/json')
    });
  }

  login(email: string, password: string) {
    const url = 'public/users/login';
    const body = {
      email: email,
      password: password
    };

    return this.postMethodWithoutAuth(url, body);
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
    maxParticipant: number,
    visibility: string,
    totalCost: number,
    eventDate: Date,
    addressId: number,
    eventTypeType: String,
    organizerEmail: string
  ) {
    const url = 'events/create';
    const body = {
      name: name,
      description: description,
      maxParticipant: maxParticipant,
      visibility: visibility,
      totalCost: totalCost,
      eventDate: eventDate,
      addressId: addressId,
      eventTypeType: eventTypeType,
      organizerEmail: organizerEmail
    };

    return this.postMethod(url, body);
  }

  createAddress(country: string, city: string, street: string, streetNumber: string) {
    const url = 'addresses/create';
    const body = {
      country: country,
      city: city,
      street: street,
      streetNumber: streetNumber
    };

    return this.postMethod(url, body);
  }

  createLikesComment(userEmail: string, commentId: number) {
    const url = 'likes-comments/create';
    const body = {
      userEmail: userEmail,
      commentId: commentId
    };

    return this.postMethod(url, body);
  }

  createLikesPost(userEmail: string, postId: number) {
    const url = 'likes-posts/create';
    const body = {
      userEmail: userEmail,
      postId: postId
    };

    return this.postMethod(url, body);
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
    const body = {
      email: email,
      password: password,
      firstname: firstname,
      lastname: lastname,
      country: country,
      city: city,
      street: street,
      streetNumber: streetNumber
    };

    return this.postMethodWithoutAuth(url, body);
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
    const url = 'invitations/create';
    const body = {
      eventId: eventId,
      userEmail: userEmail,
      isUserRequested: isUserRequested
    };

    return this.postMethod(url, body);
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
