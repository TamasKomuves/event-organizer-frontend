import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../services/rest/user.service';
import { IComment } from '../interface/IComment';
import { CommentService } from '../services/rest/comment.service';
import { PostService } from '../services/rest/post.service';
import { MessageService } from '../services/message.service';
import { EventService } from '../services/rest/event.service';
import { IEvent } from '../interface/IEvent';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-post-block',
  templateUrl: './post-block.component.html',
  styleUrls: ['./post-block.component.css']
})
export class PostBlockComponent implements OnInit {
  @Input() postId: number;
  @Input() eventId: number;

  readonly showCommentsConst = 'post.show_comments';
  readonly hideCommentsConst = 'post.hide_comments';

  text: string;
  numberOfLikes = 0;
  posterName: string;
  date: string;
  comments: Array<IComment>;
  isShowComments = false;
  isAnyComment = false;
  isCurrentUserLiked = false;
  showCommentsText = 'post.show_comments';
  commentText: string;
  isLikeButtonLoaded = false;
  shouldShowDeleteButton = false;

  constructor(
    private userService: UserService,
    private commentService: CommentService,
    private postService: PostService,
    private messageService: MessageService,
    private eventService: EventService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.postService.getPostById(this.postId).subscribe(post => {
      this.text = post.text;
      this.date = post.date;

      if (post.posterEmail === null) {
        this.translateService.get('deleted_profile').subscribe(text => {
          this.posterName = text;
        });
      } else {
        this.userService.getUserByEmail(post.posterEmail).subscribe(user => {
          this.posterName = user.firstName + ' ' + user.lastName;
        });
      }

      this.postService.getPostComments(this.postId).subscribe(comments => {
        this.comments = comments;
        this.isAnyComment = this.comments !== undefined && this.comments.length > 0;
        this.comments.sort((a, b) => a.commentDate.localeCompare(b.commentDate));
      });
      this.postService.getPostLikers(this.postId).subscribe(postLikers => {
        let likers: any;
        likers = postLikers;
        this.numberOfLikes = likers.length;
      });

      const email = sessionStorage.getItem('userEmail');
      this.postService.isLikedPost(this.postId, email).subscribe(result => {
        this.isCurrentUserLiked = result['result'] === 'true';
        this.isLikeButtonLoaded = true;
      });
      this.eventService.getEventById(this.eventId).subscribe((event: IEvent) => {
        const userEmail = sessionStorage.getItem('userEmail');
        this.shouldShowDeleteButton =
          event.organizerEmail === userEmail || post.posterEmail === userEmail;
      });
    });
    this.messageService.getCommentDeletedMessage().subscribe(result => {
      const deletedCommentId = result['commentId'];
      this.comments = this.comments.filter((comment: IComment) => comment.id !== deletedCommentId);
    });
  }

  toggleCommentVisibility(): void {
    this.isShowComments = !this.isShowComments;
    this.showCommentsText =
      this.showCommentsText === this.showCommentsConst
        ? this.hideCommentsConst
        : this.showCommentsConst;
  }

  likePost(): void {
    this.isLikeButtonLoaded = false;
    this.postService.createLikesPost(this.postId).subscribe(() => {
      this.numberOfLikes++;
      this.isCurrentUserLiked = true;
      this.isLikeButtonLoaded = true;
    });
  }

  removeLikeFromPost(): void {
    this.isLikeButtonLoaded = false;
    this.postService.removeLikesPost(this.postId).subscribe(() => {
      this.numberOfLikes--;
      this.isCurrentUserLiked = false;
      this.isLikeButtonLoaded = true;
    });
  }

  sendComment(): void {
    if (this.commentText === undefined || this.commentText === null || this.commentText === '') {
      return;
    }

    const newComment: IComment = { postId: this.postId, text: this.commentText };

    this.commentService.createComment(newComment).subscribe(
      result => {
        this.commentText = '';
        this.postService.getPostComments(this.postId).subscribe(comments => {
          this.comments = comments;
          this.isAnyComment = this.comments !== undefined && this.comments.length > 0;
          if (!this.isShowComments) {
            this.toggleCommentVisibility();
          }
        });
      },
      error => {
        this.commentText = '';
        console.log(error);
      }
    );
  }

  deletePost(): void {
    this.postService.deletePost(this.postId).subscribe(() => {
      this.messageService.sendNewsDeletedMessage(this.postId, 'POST');
    });
  }
}
