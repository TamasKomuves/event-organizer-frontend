import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-poll-creator-modal',
  templateUrl: './poll-creator-modal.component.html',
  styleUrls: ['./poll-creator-modal.component.css']
})
export class PollCreatorModalComponent implements OnInit {
  questionText: string;
  answers: Array<any>;

  constructor() {}

  ngOnInit() {
    this.answers = new Array();
  }

  addAnswer(): void {
    const id = this.answers.length + 1;
    this.answers.push({ id: 'Answer' + id, text: '' });
  }

  removeAnswer(): void {
    this.answers.pop();
  }

  createPoll(): void {
    console.log(this.answers);
  }
}
