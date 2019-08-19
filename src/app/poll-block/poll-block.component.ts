import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-poll-block',
  templateUrl: './poll-block.component.html',
  styleUrls: ['./poll-block.component.css']
})
export class PollBlockComponent implements OnInit {
  @Input() pollId: number;

  answerIds: Array<Number>;
  text: string;
  date: string;
  newAnswerText: string;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getPollQuiestionById(this.pollId).subscribe(pollQuestion => {
      this.text = pollQuestion.text;
      this.date = pollQuestion.date;
    });
    this.updateAnswers();
  }

  updateAnswers(): void {
    this.userService.getPollAnswerIdsByQuestionId(this.pollId).subscribe(answerIds => {
      this.answerIds = answerIds;
    });
  }

  createNewAnswer(): void {
    if (this.newAnswerText === null || this.newAnswerText === undefined || this.newAnswerText === '') {
      alert("Answer can't be blank");
      return;
    }
    this.userService.createPollAnswer(this.pollId, this.newAnswerText).subscribe(result => {
      this.updateAnswers();
      this.newAnswerText = '';
    });
  }
}