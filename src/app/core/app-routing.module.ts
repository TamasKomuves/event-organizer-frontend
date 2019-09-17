import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { RegistrationComponent } from '../registration/registration.component';
import { CreateEventComponent } from '../create-event/create-event.component';
import { EventComponent } from '../event/event.component';
import { ShowEventsComponent } from '../show-events/show-events.component';
import { ProfileSettingsComponent } from '../profile-settings/profile-settings.component';
import { NotificationsComponent } from '../notifications/notifications.component';
import { HomeComponent } from '../home/home.component';
import {MessagesContainerComponent} from '../messages-container/messages-container.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'create-event', component: CreateEventComponent },
  { path: 'event', component: EventComponent },
  { path: 'show-events', component: ShowEventsComponent },
  { path: 'profile-settings', component: ProfileSettingsComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'home', component: HomeComponent },
  { path: 'messages-container', component: MessagesContainerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
