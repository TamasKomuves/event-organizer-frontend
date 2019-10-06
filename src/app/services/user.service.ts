import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IComment } from '../interface/IComment';
import { INews } from '../interface/INews';
import { IAddress } from '../interface/IAddress';
import { IInvitation } from '../interface/IInvitation';
import { IPollAnswer } from '../interface/IPollAnswer';
import { IPollQuestion } from '../interface/IPollQuestion';
import { IPost } from '../interface/IPost';
import { IUser } from '../interface/IUser';
import { IEvent } from '../interface/IEvent';
import { IChatMessage } from '../interface/IChatMessage';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // SERVER_LINK = 'https://powerful-shelf-66888.herokuapp.com/';
  SERVER_LINK = 'http://localhost:8080/';

  constructor(private httpClient: HttpClient) {}

  getMethod<T>(url: string) {
    return this.httpClient.get<T>(this.SERVER_LINK + url, {
      headers: new HttpHeaders().set('authorization', 'Bearer ' + sessionStorage.getItem('token'))
    });
  }

  postMethod<T>(url: string, body: any) {
    return this.httpClient.post<T>(this.SERVER_LINK + url, body, {
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
    return this.getMethod<IUser>(url);
  }

  getUserByEmail(email: string) {
    const url = 'users/' + email;
    return this.getMethod<IUser>(url);
  }

  getEventById(id: number) {
    const url = 'events/' + id;
    return this.getMethod<IEvent>(url);
  }

  getEventPosts(eventId: number) {
    const url = 'events/' + eventId + '/posts';
    return this.getMethod<Array<IPost>>(url);
  }

  getPostComments(postId: number) {
    const url = 'posts/' + postId + '/comments';
    return this.getMethod<Array<IComment>>(url);
  }

  getPostById(postId: number) {
    const url = 'posts/' + postId;
    return this.getMethod<IPost>(url);
  }

  getPostLikers(postId: number) {
    const url = 'posts/' + postId + '/likers';
    return this.getMethod(url);
  }

  getCommentById(commentId: number) {
    const url = 'comments/' + commentId;
    return this.getMethod<IComment>(url);
  }

  getCommentLikes(commentId: number) {
    const url = 'comments/' + commentId + '/likers';
    return this.getMethod(url);
  }

  getEventParticipants(eventId: number) {
    const url = 'events/' + eventId + '/users';
    return this.getMethod<Array<IUser>>(url);
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
    return this.getMethod<IAddress>(url);
  }

  getAllEventType() {
    const url = 'event-types/all';
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
    return this.getMethod<Array<IInvitation>>(url);
  }

  getInvitationOffersForEvent(eventId: number) {
    const url = 'events/' + eventId + '/invitation-offers';
    return this.getMethod<Array<IInvitation>>(url);
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

  getPollQuiestionById(id: number) {
    const url = 'poll-questions/' + id;
    return this.getMethod<IPollQuestion>(url);
  }

  getPollAnswerById(id: number) {
    const url = 'poll-answers/' + id;
    return this.getMethod<IPollAnswer>(url);
  }

  getPollAnswerIdsByQuestionId(questionId: number) {
    const url = 'poll-questions/' + questionId + '/answerIds';
    return this.getMethod<Array<Number>>(url);
  }

  getVotesForAnswerById(id: number) {
    const url = 'poll-answers/' + id + '/votes';
    return this.getMethod(url);
  }

  createAnswersToPoll(pollAnswerId: number) {
    const url = 'answers-to-polls/create';
    const body = {
      pollAnswerId: pollAnswerId
    };

    return this.postMethod(url, body);
  }

  isAnswerAlreadySelected(pollAnswerId: number) {
    const url = 'poll-answers/' + pollAnswerId + '/is-already-selected';
    return this.getMethod(url);
  }

  deleteAnswersToPoll(id: number) {
    const url = 'answers-to-polls/' + id + '/delete';
    return this.getMethod(url);
  }

  createPollAnswer(pollQuestionId: number, text: string) {
    const url = 'poll-answers/create';
    const body = {
      pollQuestionId: pollQuestionId,
      text: text
    };

    return this.postMethod(url, body);
  }

  createPoll(eventId: number, questionText: string, pollAnswers: Array<IPollAnswer>) {
    const url = 'poll-questions/createPoll';
    const body = {
      eventId: eventId,
      questionText: questionText,
      pollAnswers: pollAnswers
    };

    return this.postMethod(url, body);
  }

  getEventPolls(eventId: number) {
    const url = 'events/' + eventId + '/polls';
    return this.getMethod<Array<IPollQuestion>>(url);
  }

  getEventNews(eventId: number) {
    const url = 'events/' + eventId + '/news';
    return this.getMethod<Array<INews>>(url);
  }

  getAllChatMessages(partnerEmail: string) {
    const url = 'chat-messages/all-messages/' + partnerEmail;
    return this.getMethod<Array<IChatMessage>>(url);
  }

  getAllUsers() {
    const url = 'users/all';
    return this.getMethod<Array<IUser>>(url);
  }

  getLastMessages() {
    const url = 'chat-messages/last-messages';
    return this.getMethod<Array<IChatMessage>>(url);
  }

  createChatMessage(chatMessage: IChatMessage) {
    const url = 'chat-messages/create';
    return this.postMethod<IChatMessage>(url, chatMessage);
  }
}
