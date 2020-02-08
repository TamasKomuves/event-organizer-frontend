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
import { MessageService } from '../services/message.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit, AfterViewInit {
  eventId: number;
  participants: Array<IUser>;
  organizerEmail: string;
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
    private postService: PostService,
    private messageService: MessageService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    const eventIdJson = this.route.snapshot.queryParamMap.get('eventId');
    this.eventId = JSON.parse(eventIdJson);

    this.loadEventInfo();

    this.eventService.getEventParticipants(this.eventId).subscribe(participants => {
      this.participants = participants;
    });

    this.updateNewsFeed();
    this.messageService.getNewsDeletedMessage().subscribe(result => {
      this.newsList = this.newsList.filter(
        (news: INews) => news.type !== result['type'] || news.id !== result['newsId']
      );
    });
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

    const eventParticipantsModal = this.ngxSmartModalService.getModal('eventParticipantsModal');
    eventParticipantsModal.onClose.subscribe(() => {
      this.eventService.getEventParticipants(this.eventId).subscribe(participants => {
        this.participants = participants;
      });
    });
  }

  loadEventInfo(): void {
    this.eventService.getEventById(this.eventId).subscribe(event => {
      this.name = event.name;
      this.type = event.eventType;
      this.date = event.eventDate;
      this.description = event.description;
      this.visibility = event.visibility;
      this.organizerEmail = event.organizerEmail;
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
      this.translate.get('popup.event.empty_email').subscribe(text => {
        alert(text);
      });
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
        this.translate.get('popup.event.invitation_sent').subscribe(text => {
          alert(text);
        });
        this.invitedUserEmail = '';
        return;
      },
      error => {
        console.log(error);
        this.translate.get('popup.event.cannot_invite').subscribe(text => {
          alert(text);
        });
        return;
      }
    );
  }

  deleteEvent(): void {
    this.translate.get('popup.event.confirm_delete_event').subscribe(text => {
      if (confirm(text)) {
        this.eventService.deleteEvent(this.eventId).subscribe(() => {
          this.router.navigateByUrl('/show-events');
        });
      }
    });
  }

  leaveEvent(): void {
    this.translate.get('popup.event.confirm_leave_event').subscribe(text => {
      if (confirm(text)) {
        const userEmail = sessionStorage.getItem('userEmail');
        this.eventService.deleteParticipant(this.eventId, userEmail).subscribe(() => {
          this.router.navigateByUrl('/show-events');
        });
      }
    });
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
