import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { INews } from '../interface/INews';
import { IUser } from '../interface/IUser';
import { IPost } from '../interface/IPost';

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
  date: string;
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
    private ngxSmartModalService: NgxSmartModalService
  ) { }

  ngOnInit() {
    const eventIdJson = this.route.snapshot.queryParamMap.get('eventId');
    this.eventId = JSON.parse(eventIdJson);

    this.loadEventInfo();

    this.userService.getEventParticipants(this.eventId).subscribe(participants => {
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
    this.userService.getEventById(this.eventId).subscribe(event => {
      this.name = event.name;
      this.type = event.eventType;
      this.date = event.eventDate;
      this.description = event.description;
      this.visibility = event.visibility;
      this.userService.getCurrentUser().subscribe(user => {
        this.isOrganizer = event.organizerEmail === user.email;
      });
      this.userService.getAddressById(event.addressId).subscribe(address => {
        this.address =
          address.street + ' ' + address.streetNumber + ', ' + address.city + ', ' + address.country;
      });
    });
  }

  sendPost(): void {
    if (this.newPostText === '' || this.newPostText === null || this.newPostText === undefined) {
      alert('Empty post');
      return;
    }

    const post: IPost = { eventId: this.eventId, text: this.newPostText }

    this.userService.createPost(post).subscribe(result => {
      this.newPostText = '';
      this.updateNewsFeed();
    });
  }

  updateNewsFeed(): void {
    this.userService.getEventNews(this.eventId).subscribe(newsList => {
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

    this.userService.createInvitation(this.eventId, this.invitedUserEmail, 0).subscribe(
      result => {
        if (result['result'] === 'success') {
          alert('Invitation sent');
        } else if (result['result'] === 'already invited') {
          alert('already invited');
        }
        this.invitedUserEmail = '';
      },
      error => {
        console.log(error);
        alert('Invalid email');
      }
    );
  }

  deleteEvent(): void {
    this.userService.deleteEvent(this.eventId).subscribe(() => { });
  }

  openViewRequestsModal(): void {
    this.openModal('invitationRequestModal');
  }

  openModal(modalId: string): void {
    const modal = this.ngxSmartModalService.getModal(modalId);
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
