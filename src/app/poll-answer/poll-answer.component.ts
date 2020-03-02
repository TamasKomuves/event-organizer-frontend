import { Component, OnInit, Input } from '@angular/core';
import { PollAnswerService } from '../services/rest/poll-answer.service';

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
  isAlreadySelected = false;
  text: string;
  numberOfVotes = 0;
  isLoaded = false;

  constructor(private pollAnswerService: PollAnswerService) {}

  ngOnInit() {
    this.checkboxId = 'checkbox' + this.answerId;
    this.initCheckbox();
    this.initAnswer();
    this.updateVotes();
  }

  initCheckbox(): void {
    this.pollAnswerService.isAnswerAlreadySelected(this.answerId).subscribe(result => {
      this.isAlreadySelected = result['isAlreadySelected'] === 'true';
    });
  }

  initAnswer(): void {
    this.pollAnswerService.getPollAnswerById(this.answerId).subscribe(
      answer => {
        this.answer = answer;
        this.text = answer.text;
      },
      error => {
        console.log(error);
      }
    );
  }

  updateVotes(): void {
    this.pollAnswerService.getVotesForAnswerById(this.answerId).subscribe(
      votes => {
        this.votes = votes;
        this.numberOfVotes = Object.keys(votes).length;
        this.isLoaded = true;
      },
      error => {
        console.log(error);
        this.isLoaded = true;
      }
    );
  }

  toggleAnswerSelection(): void {
    this.isLoaded = false;
    if (this.isAlreadySelected) {
      this.voteForAnswer();
    } else {
      this.removeVoteFromAnswer();
    }
  }

  removeVoteFromAnswer(): void {
    this.pollAnswerService.removeRespondentFromAnswer(this.answerId).subscribe(
      result => {
        this.updateVotes();
      },
      error => {
        console.log(error);
        this.isLoaded = true;
      }
    );
  }

  voteForAnswer(): void {
    this.pollAnswerService.addRespondentToAnswer(this.answerId).subscribe(
      result => {
        this.updateVotes();
      },
      error => {
        console.log(error);
        this.isLoaded = true;
      }
    );
  }
}
