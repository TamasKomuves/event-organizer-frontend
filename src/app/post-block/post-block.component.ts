import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-post-block',
  templateUrl: './post-block.component.html',
  styleUrls: ['./post-block.component.css']
})
export class PostBlockComponent implements OnInit {
  @Input() postId: number;

  text: string;
  numberOfLikes: number;
  posterName: string;
  date: string;
  comments: any;
  isShowComments: boolean;
  isAnyComment: boolean;
  isCurrentUserLiked: boolean;

  constructor(private userService: UserService) {}

  ngOnInit() {
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

        if (this.comments !== undefined && this.comments.length > 0) {
          this.isAnyComment = true;
        }
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

  setIsShowComments(isShowComments: boolean): void {
    this.isShowComments = isShowComments;
  }

  sendComment(): void {}

  likePost(): void {
    this.isCurrentUserLiked = true;
    this.userService.getCurrentUser().subscribe(data => {
      this.userService.createLikesPost(data['email'], this.postId).subscribe(result => {
        this.numberOfLikes++;
      });
    });
  }
}
