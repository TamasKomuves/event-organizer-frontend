import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-post-block',
  templateUrl: './post-block.component.html',
  styleUrls: ['./post-block.component.css']
})
export class PostBlockComponent implements OnInit {
  @Input() postId: number;

  readonly showCommentsConst = 'Show comments';
  readonly hideCommentsConst = 'Hide comments';

  text: string;
  numberOfLikes: number;
  posterName: string;
  date: string;
  comments: any;
  isShowComments: boolean;
  isAnyComment: boolean;
  isCurrentUserLiked: boolean;
  showCommentsText: string;
  commentText: string;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.showCommentsText = 'Show comments';
    this.isShowComments = false;
    this.isAnyComment = false;
    this.numberOfLikes = 0;
    this.isCurrentUserLiked = true;

    this.userService.getPostById(this.postId).subscribe(post => {
      this.text = post['text'];
      this.date = post['postDate'];
      this.userService.getUserByEmail(post['posterEmail']).subscribe(user => {
        this.posterName = user['firstName'] + ' ' + user['lastName'];
      });
      this.userService.getPostComments(this.postId).subscribe(comments => {
        this.comments = comments;
        this.isAnyComment = this.comments !== undefined && this.comments.length > 0;
      });
      this.userService.getPostLikers(this.postId).subscribe(postLikers => {
        let likers: any;
        likers = postLikers;
        this.numberOfLikes = likers.length;
      });

      this.userService.getCurrentUser().subscribe(user => {
        const email = user['email'];
        this.userService.isLikedPost(this.postId, email).subscribe(result => {
          this.isCurrentUserLiked = result['result'] === 'true';
        });
      });
    });
  }

  toggleCommentVisibility(): void {
    this.isShowComments = !this.isShowComments;
    this.showCommentsText =
      this.showCommentsText === this.showCommentsConst ? this.hideCommentsConst : this.showCommentsConst;
  }

  likePost(): void {
    this.isCurrentUserLiked = true;
    this.userService.getCurrentUser().subscribe(data => {
      this.userService.createLikesPost(data['email'], this.postId).subscribe(result => {
        this.numberOfLikes++;
      });
    });
  }

  sendComment(): void {
    if (this.commentText === undefined || this.commentText === null || this.commentText === '') {
      alert('Missing comment text');
      return;
    }

    this.userService.getCurrentUser().subscribe(user => {
      this.userService.createComment(this.postId, user['email'], this.commentText).subscribe(
        result => {
          this.commentText = '';
          this.userService.getPostComments(this.postId).subscribe(comments => {
            this.comments = comments;
            this.isAnyComment = this.comments !== undefined && this.comments.length > 0;
          });
        },
        error => {
          this.commentText = '';
          console.log(error);
        }
      );
    });
  }
}
