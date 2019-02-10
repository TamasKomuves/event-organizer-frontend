import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  SERVER_LINK = 'https://powerful-shelf-66888.herokuapp.com/';

  constructor(private httpClient: HttpClient) { }

  login(email: string, password: string) {
    let user = { email: email, password: password };

    return this.httpClient.get(this.SERVER_LINK + 'users/login/' + email + '/' + password);
  }

  logout() {
    return this.httpClient.get(this.SERVER_LINK + 'users/logout');
  }

  getCurrentUser() {
    return this.httpClient.get(this.SERVER_LINK + 'users/current-user');
  }

  getUserByEmail(email: string) {
    return this.httpClient.get(this.SERVER_LINK + 'users/' + email);
  }

  getEventById(id: number) {
    return this.httpClient.get(this.SERVER_LINK + 'events/' + id);
  }

  getEventPosts(eventId: number) {
    return this.httpClient.get(this.SERVER_LINK + 'events/' + eventId + '/posts');
  }

  getPostComments(postId: number) {
    return this.httpClient.get(this.SERVER_LINK + 'posts/' + postId + '/comments');
  }

  getPostById(postId: number) {
    return this.httpClient.get(this.SERVER_LINK + 'posts/' + postId);
  }

  getPostLikes(postId: number) {
    return this.httpClient.get(this.SERVER_LINK + 'posts/' + postId + '/likers');
  }

  getCommentById(commentId: number) {
    return this.httpClient.get(this.SERVER_LINK + 'comments/' + commentId);
  }

  getCommentLikes(commentId: number) {
    return this.httpClient.get(this.SERVER_LINK + 'comments/' + commentId + '/likers');
  }

  getEventParticipants(eventId: number) {
    return this.httpClient.get(this.SERVER_LINK + 'events/' + eventId + '/users');
  }

  createPost(eventId: number, userEmail: string, text: string) {
    console.log(this.SERVER_LINK + 'posts/create/' + eventId + '/' + userEmail + '/' + text);
    return this.httpClient.get(this.SERVER_LINK + 'posts/create/' + eventId + '/' + userEmail + '/' + text);
  }

  createComment(postId: number, commenter_email: string, text: string) {
    return this.httpClient.get(this.SERVER_LINK + 'comments/create/' + postId + '/' + commenter_email + '/' + text);
  }

  createEvent(name: string, description: string, max_participant: number, visibility: string, total_cost: number, event_date: string, address_id: number, event_type_type: String, organizer_email: string) {
    return this.httpClient.get(this.SERVER_LINK + 'events/create/' +
      name + '/' + description + '/' + max_participant + '/' + visibility + '/' +
      total_cost + '/' + event_date + '/' + address_id + '/' + event_type_type + '/' +
      organizer_email);
  }

  createAddress(country: string, city: string, street: string, streetNumber: string) {
    return this.httpClient.get(this.SERVER_LINK + 'addresses/create/' + country + '/' + city + '/' + street + '/' + streetNumber);
  }

  createLikesComment(userEmail: string, commentId: number) {
    return this.httpClient.get(this.SERVER_LINK + 'likes-comments/create/' + userEmail + '/' + commentId);
  }

  createLikesPost(userEmail: string, postId: number) {
    return this.httpClient.get(this.SERVER_LINK + 'likes-posts/create/' + userEmail + '/' + postId);
  }

  isLikedComment(commentId: number, email: string) {
    return this.httpClient.get(this.SERVER_LINK + 'comments/' + commentId + '/likers/' + email);
  }

  isLikedPost(postId: number, email: string) {
    return this.httpClient.get(this.SERVER_LINK + 'posts/' + postId + '/likers/' + email);
  }

  register(email: string, password: String, firstname: String, lastname: String, country: String, city: String, street: String, streetNumber: String) {
    return this.httpClient.get(this.SERVER_LINK + 'users/registration/' + email + '/' + password + '/' + firstname + '/' + lastname + '/' + country + '/' + city + '/' + street + '/' + streetNumber);
  }

  getAllEvents() {
    return this.httpClient.get(this.SERVER_LINK + 'events');
  }

  isUserParticipateInEvent(eventId: number, userEmail: String) {
    return this.httpClient.get(this.SERVER_LINK + 'events/' + eventId + '/is-participate/' + userEmail);
  }

  addUserToEvent(eventId: number, userEmail: String) {
    return this.httpClient.get(this.SERVER_LINK + 'events/' + eventId + '/add-user/' + userEmail);
  }

  getInvitationsForUser(userEmail: String) {
    return this.httpClient.get(this.SERVER_LINK + 'invitations/users/' + userEmail);
  }

  answerToInvitation(invitationId: number, isAccepted: number) {
    return this.httpClient.get(this.SERVER_LINK + 'invitations/' + invitationId + '/answer/' + isAccepted);
  }

  getInvitationById(invitationId: string) {
    return this.httpClient.get(this.SERVER_LINK + 'invitations/' + invitationId);
  }

  createInvitation(eventId: number, userEmail: string, isUserRequested: number) {
    return this.httpClient.get(this.SERVER_LINK + 'invitations/create/' + eventId + '/' + userEmail + '/' + isUserRequested);
  }
}







