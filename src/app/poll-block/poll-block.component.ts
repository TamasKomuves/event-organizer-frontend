import { Component, OnInit, Input } from '@angular/core';
import { PollAnswerService } from '../services/rest/poll-answer.service';
import { PollQuestionService } from '../services/rest/poll-question.service';
import { MessageService } from '../services/message.service';
import { EventService } from '../services/rest/event.service';
import { IEvent } from '../interface/IEvent';

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
  shouldShowDeleteButton = false;

  constructor(
    private pollAnswerService: PollAnswerService,
    private pollQuestionService: PollQuestionService,
    private messageService: MessageService,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.pollQuestionService.getPollQuiestionById(this.pollId).subscribe(pollQuestion => {
      this.text = pollQuestion.text;
      this.date = pollQuestion.date;
    });
    this.updateAnswers();
    this.eventService.getEventById(this.eventId).subscribe((event: IEvent) => {
      const userEmail = sessionStorage.getItem('userEmail');
      this.shouldShowDeleteButton = event.organizerEmail === userEmail;
    });
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
      return;
    }
    this.pollAnswerService.createPollAnswer(this.pollId, this.newAnswerText).subscribe(result => {
      this.updateAnswers();
      this.newAnswerText = '';
    });
  }

  deletePoll(): void {
    this.pollQuestionService.deletePoll(this.pollId).subscribe(() => {
      this.messageService.sendNewsDeletedMessage(this.pollId, 'POLL');
    });
  }
}
