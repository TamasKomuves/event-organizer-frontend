import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  eventId: any;
  participants: any;
  name: string;
  type: string;
  date: string;
  description: string;
  posts: any;
  newPost: string;
  invitedUserEmail: string;
  isOrganizer = false;

  constructor(private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit() {
    const eventIdJson = this.route.snapshot.queryParamMap.get('eventId');
    this.eventId = JSON.parse(eventIdJson);

    this.userService.getEventById(this.eventId).subscribe(event => {
      this.name = event['name'];
      this.type = event['eventType'];
      this.date = event['eventDate'];
      this.description = event['description'];
      this.userService.getCurrentUser().subscribe(user => {
        this.isOrganizer = event['organizerEmail'] === user['email'];
      });
    });

    this.userService.getEventPosts(this.eventId).subscribe(data => {
      this.posts = data;
      this.posts = this.posts.sort((a, b) => b.postDate.localeCompare(a.postDate));
    });

    this.userService.getEventParticipants(this.eventId).subscribe(data => {
      this.participants = data;
    });
  }

  sendPost(): void {
    if (this.newPost == '' || this.newPost == null || this.newPost == undefined) {
      alert('Empty post');
      return;
    }

    this.userService.getCurrentUser().subscribe(data => {
      let userEmail = data['email'];

      this.userService.createPost(this.eventId, userEmail, this.newPost).subscribe(data => {
        this.newPost = '';
        this.userService.getEventPosts(this.eventId).subscribe(data => {
          this.posts = data;
          this.posts = this.posts.sort((a, b) => b.postDate.localeCompare(a.postDate));
        });
      });
    }, error => {
      console.log(error);
    });
  }

  inviteUser(): void {
    if (this.invitedUserEmail == '' || this.invitedUserEmail == null || this.invitedUserEmail == undefined) {
      alert('Please fill the email field!');
      return;
    }

    this.userService.createInvitation(this.eventId, this.invitedUserEmail, 0).subscribe(data => {
      this.invitedUserEmail = '';
      alert('Request sent');
    }, error => {
      console.log(error);
      alert('Invalid email');
    });
  }
}
