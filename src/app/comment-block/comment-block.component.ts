import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../services/rest/user.service';
import { CommentService } from '../services/rest/comment.service';
import { MessageService } from '../services/message.service';
import { EventService } from '../services/rest/event.service';
import { IEvent } from '../interface/IEvent';

@Component({
  selector: 'app-comment-block',
  templateUrl: './comment-block.component.html',
  styleUrls: ['./comment-block.component.css']
})
export class CommentBlockComponent implements OnInit {
  @Input() commentId: number;
  @Input() eventId: number;

  text: string;
  commenterName: string;
  commentDate: string;
  numberOfLikes: number;
  isCurrentUserLiked = false;
  isLikeButtonLoaded = false;
  shouldShowDeleteButton = false;

  constructor(
    private userService: UserService,
    private commentService: CommentService,
    private messageService: MessageService,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.numberOfLikes = 0;

    this.commentService.getCommentById(this.commentId).subscribe(comment => {
      this.text = comment.text;
      this.commentDate = comment.commentDate;

      if (comment.commenterEmail === null) {
        this.commenterName = 'deleted profile';
      } else {
        this.userService.getUserByEmail(comment.commenterEmail).subscribe(user => {
          this.commenterName = user.firstName + ' ' + user.lastName;
        });
      }

      this.commentService.getCommentLikes(this.commentId).subscribe(commentLikers => {
        let likers: any;
        likers = commentLikers;
        this.numberOfLikes = likers.length;
      });
      this.eventService.getEventById(this.eventId).subscribe((event: IEvent) => {
        const userEmail = sessionStorage.getItem('userEmail');
        this.shouldShowDeleteButton =
          comment.commenterEmail === userEmail || event.organizerEmail === userEmail;
      });
    });

    const email = sessionStorage.getItem('userEmail');
    this.commentService.isLikedComment(this.commentId, email).subscribe(result => {
      this.isCurrentUserLiked = result['result'] === 'true';
      this.isLikeButtonLoaded = true;
    });
  }

  likeComment(): void {
    this.isLikeButtonLoaded = false;
    this.commentService.addLiker(this.commentId).subscribe(result => {
      this.numberOfLikes++;
      this.isLikeButtonLoaded = true;
      this.isCurrentUserLiked = true;
    });
  }

  removeLikeFromComment(): void {
    this.isLikeButtonLoaded = false;
    this.commentService.removeLikesComment(this.commentId).subscribe(() => {
      this.numberOfLikes--;
      this.isLikeButtonLoaded = true;
      this.isCurrentUserLiked = false;
    });
  }

  deleteComment(): void {
    this.commentService.deleteComment(this.commentId).subscribe(() => {
      this.messageService.sendCommentDeletedMessage(this.commentId);
    });
  }
}
