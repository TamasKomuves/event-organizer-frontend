import { Component, OnInit, Input } from '@angular/core';
import { PollAnswerService } from '../services/rest/poll-answer.service';
import { PollQuestionService } from '../services/rest/poll-question.service';

@Component({
  selector: 'app-poll-block',
  templateUrl: './poll-block.component.html',
  styleUrls: ['./poll-block.component.css']
})
export class PollBlockComponent implements OnInit {
  @Input() pollId: number;
  @Input() eventId: number;

  answerIds: Array<Number>;
  text: string;
  date: string;
  newAnswerText: string;

  constructor(
    private pollAnswerService: PollAnswerService,
    private pollQuestionService: PollQuestionService
  ) {}

  ngOnInit() {
    this.pollQuestionService.getPollQuiestionById(this.pollId).subscribe(pollQuestion => {
      this.text = pollQuestion.text;
      this.date = pollQuestion.date;
    });
    this.updateAnswers();
  }

  updateAnswers(): void {
    this.pollQuestionService.getPollAnswerIdsByQuestionId(this.pollId).subscribe(answerIds => {
      this.answerIds = answerIds;
    });
  }

  createNewAnswer(): void {
    if (
      this.newAnswerText === null ||
      this.newAnswerText === undefined ||
      this.newAnswerText === ''
    ) {
      alert("Answer can't be blank");
      return;
    }
    this.pollAnswerService.createPollAnswer(this.pollId, this.newAnswerText).subscribe(result => {
      this.updateAnswers();
      this.newAnswerText = '';
    });
  }
}
