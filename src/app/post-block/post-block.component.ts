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

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.isShowComments = false;
    this.isAnyComment = false;
    this.numberOfLikes = 0;
    this.isCurrentUserLiked = true;

    this.userService.getPostById(this.postId).subscribe(data => {
      this.text = data['text'];
      this.date = data['postDate'];
      this.userService.getUserByEmail(data['posterEmail']).subscribe(data2 => {
        this.posterName = data2['firstName'] + ' ' + data2['lastName'];
      })
      this.userService.getPostComments(this.postId).subscribe(data2 => {
        this.comments = data2;

        if (this.comments != undefined && this.comments.length > 0) {
          this.isAnyComment = true;
        }
      })
      this.userService.getPostLikes(this.postId).subscribe(data => {
        var likers: any;
        likers = data;
        this.numberOfLikes = likers.length;
      });

      this.userService.getCurrentUser().subscribe(data => {
        let email = data['email'];
        this.userService.isLikedPost(this.postId, email).subscribe(data2 => {
          this.isCurrentUserLiked = data2['result'] === 'true';
        });
      });
    });
  }

  setIsShowComments(isShowComments: boolean): void {
    this.isShowComments = isShowComments;
  }

  sendComment(): void {

  }

  likePost(): void {
    this.isCurrentUserLiked = true;
    this.userService.getCurrentUser().subscribe(data => {
      this.userService.createLikesPost(data['email'], this.postId).subscribe(data2 => {
        this.numberOfLikes++;
      });
    });
  }

}
