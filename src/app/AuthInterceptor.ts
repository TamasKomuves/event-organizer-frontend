import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpErrorResponse,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageService } from './services/message.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private messageService: MessageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError(x => this.handleAuthError(x)));
  }

  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    if ((err.status === 401 || err.status === 403) && this.router.url !== '/registration') {
      sessionStorage.setItem('token', '');
      sessionStorage.setItem('userEmail', '');
      this.router.navigateByUrl(`/login`);
      this.messageService.sendLoggedInMessage(false);
      return of(err.message);
    }
    return throwError(err);
  }
}
