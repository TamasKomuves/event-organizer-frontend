import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './core/app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { NgxSpinnerModule } from 'ngx-spinner';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { EventComponent } from './event/event.component';
import { ShowEventsComponent } from './show-events/show-events.component';
import { ProfileSettingsComponent } from './profile-settings/profile-settings.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PostBlockComponent } from './post-block/post-block.component';
import { CommentBlockComponent } from './comment-block/comment-block.component';
import { EventBlockComponent } from './event-block/event-block.component';
import { NotificationBlockComponent } from './notification-block/notification-block.component';
import { UserService } from './services/rest/user.service';
import { MessageService } from './services/message.service';
import { HomeComponent } from './home/home.component';
import { ViewRequestModalComponent } from './modals/view-request-modal/view-request-modal.component';
import { InvitationRequestBlockComponent } from './invitation-request-block/invitation-request-block.component';
import { InvitationOffersModalComponent } from './modals/invitation-offers-modal/invitation-offers-modal.component';
import { InvitationOfferBlockComponent } from './invitation-offer-block/invitation-offer-block.component';
import { EventParticipantsModalComponent } from './modals/event-participants-modal/event-participants-modal.component';
import { ModifyEventInfoModalComponent } from './modals/modify-event-info-modal/modify-event-info-modal.component';
import { DatePipe } from '@angular/common';
import { PollBlockComponent } from './poll-block/poll-block.component';
import { PollAnswerComponent } from './poll-answer/poll-answer.component';
import { PollCreatorModalComponent } from './modals/poll-creator-modal/poll-creator-modal.component';
import { MessagesContainerComponent } from './messages-container/messages-container.component';
import { FindUserToMessageModalComponent } from './modals/find-user-to-message-modal/find-user-to-message-modal.component';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { MessagesContainerBlockComponent } from './messages-container-block/messages-container-block.component';
import { Router } from '@angular/router';
import { AuthInterceptor } from './AuthInterceptor';
import { WebsocketService } from './services/websocket.service';
import { DlDateTimeDateModule, DlDateTimePickerModule } from 'angular-bootstrap-datetimepicker';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ChatBotPageComponent } from './chat-bot-page/chat-bot-page.component';

export const createTranslateLoader = (httpClient: HttpClient) => {
  return new TranslateHttpLoader(httpClient, 'assets/i18n/', '.json');
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    NavbarComponent,
    CreateEventComponent,
    EventComponent,
    ShowEventsComponent,
    ProfileSettingsComponent,
    NotificationsComponent,
    PostBlockComponent,
    CommentBlockComponent,
    EventBlockComponent,
    NotificationBlockComponent,
    HomeComponent,
    ViewRequestModalComponent,
    InvitationRequestBlockComponent,
    InvitationOffersModalComponent,
    InvitationOfferBlockComponent,
    EventParticipantsModalComponent,
    ModifyEventInfoModalComponent,
    PollBlockComponent,
    PollAnswerComponent,
    PollCreatorModalComponent,
    MessagesContainerComponent,
    FindUserToMessageModalComponent,
    ChatPageComponent,
    MessagesContainerBlockComponent,
    ChatBotPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxSmartModalModule.forRoot(),
    NgxSpinnerModule,
    DlDateTimeDateModule,
    DlDateTimePickerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    UserService,
    MessageService,
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useFactory: function(router: Router, messageService: MessageService) {
        return new AuthInterceptor(router, messageService);
      },
      multi: true,
      deps: [Router, MessageService]
    },
    WebsocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
