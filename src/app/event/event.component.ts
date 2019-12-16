import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/rest/user.service';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { INews } from '../interface/INews';
import { IUser } from '../interface/IUser';
import { IPost } from '../interface/IPost';
import { IInvitation } from '../interface/IInvitation';
import { WebsocketService } from '../services/websocket.service';
import { AddressService } from '../services/rest/address.service';
import { EventService } from '../services/rest/event.service';
import { InvitationService } from '../services/rest/invitation.service';
import { PostService } from '../services/rest/post.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit, AfterViewInit {
  eventId: any;
  participants: Array<IUser>;
  name: string;
  type: string;
  date: Date;
  description: string;
  newsList: Array<INews>;
  newPostText: string;
  invitedUserEmail: string;
  isOrganizer = false;
  address: string;
  visibility: string;
  showNewsStep = 6;
  numberOfNewsToShow = this.showNewsStep;
  newsLength = 0;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private ngxSmartModalService: NgxSmartModalService,
    private router: Router,
    private websocketService: WebsocketService,
    private addressService: AddressService,
    private eventService: EventService,
    private invitationService: InvitationService,
    private postService: PostService
  ) {}

  ngOnInit() {
    const eventIdJson = this.route.snapshot.queryParamMap.get('eventId');
    this.eventId = JSON.parse(eventIdJson);

    this.loadEventInfo();

    this.eventService.getEventParticipants(this.eventId).subscribe(participants => {
      this.participants = participants;
    });

    this.updateNewsFeed();
  }

  ngAfterViewInit() {
    const modifyEventInfoModal = this.ngxSmartModalService.getModal('modifyEventInfoModal');
    modifyEventInfoModal.onClose.subscribe((modal: NgxSmartModalComponent) => {
      this.loadEventInfo();
    });

    const pollCreatorModal = this.ngxSmartModalService.getModal('pollCreatorModal');
    pollCreatorModal.onClose.subscribe((modal: NgxSmartModalComponent) => {
      this.updateNewsFeed();
    });
  }

  loadEventInfo(): void {
    this.eventService.getEventById(this.eventId).subscribe(event => {
      this.name = event.name;
      this.type = event.eventType;
      this.date = event.eventDate;
      this.description = event.description;
      this.visibility = event.visibility;
      this.userService.getCurrentUser().subscribe(user => {
        this.isOrganizer = event.organizerEmail === user.email;
      });
      this.addressService.getAddressById(event.addressId).subscribe(address => {
        this.address =
          address.street +
          ' ' +
          address.streetNumber +
          ', ' +
          address.city +
          ', ' +
          address.country;
      });
    });
  }

  sendPost(): void {
    if (this.newPostText === '' || this.newPostText === null || this.newPostText === undefined) {
      alert('Empty post');
      return;
    }

    const post: IPost = { eventId: this.eventId, text: this.newPostText };

    this.postService.createPost(post).subscribe(result => {
      this.newPostText = '';
      this.updateNewsFeed();
    });
  }

  updateNewsFeed(): void {
    this.eventService.getEventNews(this.eventId).subscribe(newsList => {
      this.newsList = newsList;
      this.newsList = this.newsList.sort((a, b) => b.date.localeCompare(a.date));
      this.numberOfNewsToShow = this.showNewsStep;
      this.newsLength = this.newsList.length;
    });
  }

  inviteUser(): void {
    if (
      this.invitedUserEmail === '' ||
      this.invitedUserEmail === null ||
      this.invitedUserEmail === undefined
    ) {
      alert('Please fill the email field!');
      return;
    }

    const invitation: IInvitation = {
      eventId: this.eventId,
      userEmail: this.invitedUserEmail,
      isUserRequested: 0
    };

    this.invitationService.createInvitation(invitation).subscribe(
      (savedInvitation: IInvitation) => {
        this.websocketService.send(
          '/socket-subscriber/send/invitation',
          JSON.stringify(savedInvitation)
        );
        alert('Invitation sent');
        this.invitedUserEmail = '';
      },
      error => {
        console.log(error);
        alert('Cannot invite');
      }
    );
  }

  deleteEvent(): void {
    if (confirm('Are you sure you want to delete this event?\nThis action cannot be undone!')) {
      this.eventService.deleteEvent(this.eventId).subscribe(() => {
        this.router.navigateByUrl('/show-events');
      });
    }
  }

  openViewRequestsModal(): void {
    this.openModal('invitationRequestModal');
  }

  openModal(modalId: string): void {
    const modal = this.ngxSmartModalService.getModal(modalId);
    modal.dismissable = false;
    modal.open();
  }

  openPollCreatorModal(): void {
    this.openModal('pollCreatorModal');
  }

  openInvitationOffersModal(): void {
    this.openModal('invitationOffersModal');
  }

  openEventParticipantsModal(): void {
    this.openModal('eventParticipantsModal');
  }

  openModifyEventInfoModal(): void {
    this.openModal('modifyEventInfoModal');
  }

  showMoreNews(): void {
    this.numberOfNewsToShow += this.showNewsStep;
    this.numberOfNewsToShow = Math.min(this.numberOfNewsToShow, this.newsList.length);
  }
}
