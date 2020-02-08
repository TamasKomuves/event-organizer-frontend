import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private loggedInSubject = new Subject<any>();
  private deletedCommentSubject = new Subject<any>();
  private newsDeletedMessageSubject = new Subject<any>();

  constructor() {}

  getLoggedInMessage(): Observable<any> {
    return this.loggedInSubject.asObservable();
  }

  sendLoggedInMessage(isLoggedIn: boolean) {
    this.loggedInSubject.next({ isLoggedIn: isLoggedIn });
  }

  getCommentDeletedMessage(): Observable<any> {
    return this.deletedCommentSubject.asObservable();
  }

  sendCommentDeletedMessage(commentId: number) {
    this.deletedCommentSubject.next({ commentId: commentId });
  }

  getNewsDeletedMessage(): Observable<any> {
    return this.newsDeletedMessageSubject.asObservable();
  }

  sendNewsDeletedMessage(newsId: number, type: string) {
    this.newsDeletedMessageSubject.next({ newsId: newsId, type: type });
  }
}
