import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-comment-block',
  templateUrl: './comment-block.component.html',
  styleUrls: ['./comment-block.component.css']
})
export class CommentBlockComponent implements OnInit {
  @Input() commentId: number;

  text: string;
  commenterName: string;
  date: string;
  numberOfLikes: number;
  isCurrentUserLiked = true;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.numberOfLikes = 0;

    this.userService.getCommentById(this.commentId).subscribe(comment => {
      this.text = comment['text'];
      this.date = comment['commentDate'];
      this.userService.getUserByEmail(comment['commenterEmail']).subscribe(user => {
        this.commenterName = user['firstName'] + ' ' + user['lastName'];
      });
      this.userService.getCommentLikes(this.commentId).subscribe(commentLikers => {
        let likers: any;
        likers = commentLikers;
        this.numberOfLikes = likers.length;
      });
    });

    this.userService.getCurrentUser().subscribe(user => {
      const email = user['email'];
      this.userService.isLikedComment(this.commentId, email).subscribe(result => {
        this.isCurrentUserLiked = result['result'] === 'true';
      });
    });
  }

  likeComment(): void {
    this.isCurrentUserLiked = true;
    this.userService.getCurrentUser().subscribe(user => {
      this.userService.createLikesComment(user['email'], this.commentId).subscribe(result => {
        this.numberOfLikes++;
      });
    });
  }
}
