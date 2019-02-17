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

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.numberOfLikes = 0;

    this.userService.getCommentById(this.commentId).subscribe(data => {
      this.text = data['text'];
      this.date = data['date'];
      this.userService.getUserByEmail(data['commenterEmail']).subscribe(data2 => {
        this.commenterName = data2['firstName'] + ' ' + data2['lastName'];
      });
      this.userService.getCommentLikes(this.commentId).subscribe(data => {
        var likers: any;
        likers = data;
        this.numberOfLikes = likers.length;
      });
    });
  }
}
