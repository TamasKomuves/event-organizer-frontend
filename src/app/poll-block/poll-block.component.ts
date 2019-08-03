import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-poll-block',
  templateUrl: './poll-block.component.html',
  styleUrls: ['./poll-block.component.css']
})
export class PollBlockComponent implements OnInit {
  @Input() pollId: number;

  answerIds: any;
  pollQuestion: any;
  votes: any;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getPollQuiestionById(this.pollId).subscribe(pollQuestion => {
      this.pollQuestion = pollQuestion;
    });

    this.userService.getPollAnswerIdsByQuestionId(this.pollId).subscribe(answerIds => {
      this.answerIds = answerIds;
    });
  }
}
