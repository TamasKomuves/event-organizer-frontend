import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-poll-answer',
  templateUrl: './poll-answer.component.html',
  styleUrls: ['./poll-answer.component.css']
})
export class PollAnswerComponent implements OnInit {
  @Input() answerId: number;

  checkboxId: string;
  answer: any;
  votes: any;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.checkboxId = 'checkbox' + this.answerId;
    this.userService.getPollAnswerById(this.answerId).subscribe(
      answer => {
        this.answer = answer;
      },
      error => {
        console.log(error);
      }
    );
    this.votes = this.userService.getVotesForAnswerById(this.answerId).subscribe(
      votes => {
        this.votes = votes;
      },
      error => {
        console.log(error);
      }
    );
  }

  voteForAnswer(): void {
    this.userService.createAnswersToPoll(this.answerId).subscribe(result => {});
  }
}
