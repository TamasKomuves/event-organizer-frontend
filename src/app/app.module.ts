import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './core/app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

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
import { UserService } from './services/user.service';
import { MessageService } from './services/message.service';
import { HomeComponent } from './home/home.component';

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
    HomeComponent
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [UserService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule {}
